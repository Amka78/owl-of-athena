import { EventIds } from "../sdk/AuroraConstants";
import type {
    AuroraEventJson,
    AuroraSessionCSV,
    AuroraSessionJson,
    AuroraStreamJson,
} from "../sdk/AuroraTypes";
import { AuroraEvent, AuroraSession, AuroraSessionDetail, AuroraStream } from "../sdk/models";
import { supabase } from "./supabase";

/**
 * 数値を ms 整数へ丸める（CSV 由来の値に小数があると bigint カラムへの
 * キャストが失敗するため）。undefined/null は undefined のまま返す。
 */
const toIntOrUndefined = (value: number | undefined): number | undefined => {
    if (value === undefined || value === null || !Number.isFinite(value)) return undefined;
    return Math.round(value);
};

/**
 * epoch ms（数値）を ISO 文字列へ変換する。0 / 不正値は undefined を返し、
 * カラムを NULL のままにする。
 */
const toIsoStringOrUndefined = (epochMs: number | undefined): string | undefined => {
    if (epochMs === undefined || !Number.isFinite(epochMs) || epochMs <= 0) return undefined;
    return new Date(epochMs).toISOString();
};

/**
 * Managing session-related Supabase communication
 *
 * @export
 * @class SessionRestClient
 */
export class SessionRestClient {
    /** @deprecated Supabase manages auth internally; this is kept for API compatibility. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public set getTokenCallback(_callback: () => string) {}

    /**
     * Register a session.
     *
     * CSV セッションはそのまま INSERT できない（PostgREST は未知カラムを PGRST204 で
     * 拒否する）ため、読み出し側（AuroraSessionJson / セッション一覧）と同じ
     * 構造化カラムへマッピングして保存する。
     *
     * @param {AuroraSessionCSV} sessionJson
     * @returns {Promise<AuroraSession>}
     * @memberof SessionRestClient
     */
    public async create(sessionJson: AuroraSessionCSV): Promise<AuroraSession> {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        const auroraProfileId = await this.resolveAuroraProfileId(sessionJson.profile?.id);

        const sleepDuration = sessionJson.sleepDuration ?? {};

        const sessionPayload = {
            user_id: user?.id,
            aurora_profile_id: auroraProfileId,
            aurora_profile_name: sessionJson.profile?.name ?? null,
            firmware_version: toIntOrUndefined(sessionJson.version),
            sleep_onset: toIntOrUndefined(sessionJson.sleepOnset),
            session_duration: toIntOrUndefined(sessionJson.duration),
            sleep_duration: toIntOrUndefined(sleepDuration.total),
            no_signal_duration: toIntOrUndefined(sleepDuration.unknown),
            awake_duration: toIntOrUndefined(sleepDuration.awake),
            light_duration: toIntOrUndefined(sleepDuration.light),
            deep_duration: toIntOrUndefined(sleepDuration.deep),
            rem_duration: toIntOrUndefined(sleepDuration.rem),
            sleep_score: toIntOrUndefined(sessionJson.sleepScore),
            incomplete: sessionJson.incomplete,
            asleep_at: toIsoStringOrUndefined(sessionJson.asleepAt),
            awake_at: toIsoStringOrUndefined(sessionJson.awakeAt),
            // session_at は NOT NULL。date が無い場合は現在時刻で代用する
            session_at: toIsoStringOrUndefined(sessionJson.date) ?? new Date().toISOString(),
            app_platform: sessionJson.app_platform,
            app_version: sessionJson.app_version,
            session_txt: sessionJson.content,
        };

        const { data, error } = await supabase
            .from("aurora_sessions")
            .insert(sessionPayload)
            .select()
            .single();

        if (error) throw error;

        const newSession = data as AuroraSessionJson;

        // 詳細画面のグラフ用にイベント（睡眠ステージ・刺激・覚醒等）も保存する。
        // Electron 版はサーバが session_text を解析して events を保存しており、
        // get_session_events RPC がこのデータを返すことでクロスデバイスでも
        // グラフを描画できる（端末フォールバック不要になる）。
        try {
            await this.insertSessionEvents(newSession.id, sessionJson.events);
        } catch (e) {
            // セッション行だけ残ると次回同期で重複するため、行ごと取り消して失敗扱いにする
            // （端末側はリネームされず、次回の同期で再送される）。
            try {
                await supabase.from("aurora_sessions").delete().eq("id", newSession.id);
            } catch {
                // ロールバックに失敗しても元のエラーを優先して報告する
            }
            throw e;
        }

        return new AuroraSession(newSession);
    }

    /**
     * セッションのイベントを aurora_events に一括 INSERT する。
     * 件数が多いセッションを想定し、チャンク単位で送る。
     */
    private async insertSessionEvents(
        sessionId: string,
        events: Array<AuroraEventJson>,
    ): Promise<void> {
        if (!events?.length) return;

        const eventRows = events
            .filter((event) => event && Number.isFinite(event.time) && Number.isFinite(event.flags))
            .map((event) => ({
                aurora_session_id: sessionId,
                aurora_event_id: toIntOrUndefined(event.id) ?? 0,
                event_at: toIntOrUndefined(event.date),
                time: toIntOrUndefined(event.time) ?? 0,
                flags: toIntOrUndefined(event.flags) ?? 0,
            }));

        const chunkSize = 500;
        for (let i = 0; i < eventRows.length; i += chunkSize) {
            const { error } = await supabase
                .from("aurora_events")
                .insert(eventRows.slice(i, i + chunkSize));

            if (error) throw error;
        }
    }

    /**
     * デバイス上のプロフィール id がこのアプリの aurora_profiles に存在する場合のみ
     * セッションへ紐付ける。存在しない id を送ると外部キー制約でセッション保存自体が
     * 失敗するため、見つからない場合は未設定（NULL）にする。
     */
    private async resolveAuroraProfileId(profileId?: string): Promise<string | undefined> {
        if (!profileId) return undefined;

        try {
            const { data } = await supabase
                .from("aurora_profiles")
                .select("id")
                .eq("id", profileId)
                .maybeSingle();

            return data?.id;
        } catch {
            return undefined;
        }
    }

    /**
     * Get your own sessions.
     *
     * @param {string} userId
     * @returns {Promise<Array<AuroraSession>>}
     * @memberof SessionRestClient
     */
    public async getAll(userId: string): Promise<Array<AuroraSession>> {
        const { data, error } = await supabase
            .from("aurora_sessions")
            .select("*")
            .eq("user_id", userId)
            .order("session_at", { ascending: true });

        if (error) throw error;

        return (data as AuroraSessionJson[]).map((value) => new AuroraSession(value)).reverse();
    }

    /**
     * Get the session of the specified ID.
     *
     * @param {string} sessionId
     * @returns {Promise<AuroraSession>}
     * @memberof SessionRestClient
     */
    public async getById(sessionId: string): Promise<AuroraSession> {
        const { data, error } = await supabase
            .from("aurora_sessions")
            .select("*")
            .eq("id", sessionId)
            .single();

        if (error) throw error;

        return new AuroraSession(data as AuroraSessionJson);
    }

    /**
     * Get the streams of the specified session.
     *
     * @param {string} sessionId
     * @returns {Promise<Array<AuroraStream>>}
     * @memberof SessionRestClient
     */
    public async getStreams(sessionId: string): Promise<Array<AuroraStream>> {
        const { data, error } = await supabase
            .from("aurora_streams")
            .select("*")
            .eq("aurora_session_id", sessionId);

        if (error) throw error;

        return (data as AuroraStreamJson[]).map((value) => new AuroraStream(value));
    }

    /**
     * Get the events of the specified session.
     * Calls the Supabase RPC function `get_session_events` for each event type.
     *
     * @param {string} sessionId
     * @returns {Promise<any>}
     * @memberof SessionRestClient
     */
    public async getEvents(sessionId: string): Promise<any> {
        const queries: { [index: string]: any } = {
            movementEvents: {
                bins: "0,5,10,15,20",
                aurora_event_id: EventIds.MOVEMENT_MONITOR,
                group_by: "average",
            },
            sleepEvents: {
                bins: "0,5,10,15,20,25",
                aurora_event_id: EventIds.SLEEP_TRACKER_MONITOR,
                group_by: "duration",
            },
            awakeningEvents: {
                bins: "0,15,30,45,60",
                aurora_event_id: EventIds.AWAKENING,
                group_by: "sum",
            },
            stimEvents: {
                bins: "0,15,30,45,60",
                aurora_event_id: EventIds.STIM_PRESENTED,
                group_by: "count",
            },
            buttonEvents: {
                bins: "0,15,30,45,60",
                aurora_event_id: EventIds.BUTTON_MONITOR,
                flags: 1,
                group_by: "sum",
            },
        };

        return Promise.all(
            Object.entries(queries).map(async ([eventIndex, eventQuery]) => {
                const { data, error } = await supabase.rpc("get_session_events", {
                    p_session_id: sessionId,
                    p_aurora_event_id: eventQuery.aurora_event_id,
                    p_bins: eventQuery.bins,
                    p_group_by: eventQuery.group_by,
                    p_flags: eventQuery.flags ?? null,
                });

                if (error) throw error;

                const auroraEvents = (data as AuroraEventJson[]).map(
                    (value) => new AuroraEvent(value),
                );

                queries[eventIndex] = auroraEvents;
            }),
        ).then(() => queries);
    }

    /**
     * Get the detailed information of the specified session.
     *
     * @param {string} sessionId
     * @returns {Promise<AuroraSessionDetail>}
     * @memberof SessionRestClient
     */
    public async getDetailsById(sessionId: string): Promise<AuroraSessionDetail> {
        const streams = await this.getStreams(sessionId);
        const events = await this.getEvents(sessionId);

        const sessionDetail = new AuroraSessionDetail(
            sessionId,
            streams,
            events.awakeningEvents,
            events.buttonEvents,
            events.movementEvents,
            events.sleepEvents,
            events.stimEvents,
        );

        console.debug("sessionDetail:", sessionDetail);
        return sessionDetail;
    }

    /**
     * Delete the session of the specified ID.
     *
     * @param {string} sessionId
     * @returns {Promise<void>}
     * @memberof SessionRestClient
     */
    public async deleteById(sessionId: string): Promise<void> {
        const { error } = await supabase.from("aurora_sessions").delete().eq("id", sessionId);

        if (error) throw error;
    }

    /**
     * Session update process
     *
     * @param {string} sessionId
     * @param {Partial<AuroraSessionJson>} updateInfo
     * @returns {Promise<void>}
     * @memberof SessionRestClient
     */
    public async updateById(
        sessionId: string,
        updateInfo: Partial<AuroraSessionJson>,
    ): Promise<void> {
        const { error } = await supabase
            .from("aurora_sessions")
            .update(updateInfo)
            .eq("id", sessionId);

        if (error) throw error;
    }
}
export default new SessionRestClient();
