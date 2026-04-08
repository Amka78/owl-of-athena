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
     * @param {AuroraSessionCSV} sessionJson
     * @returns {Promise<AuroraSession>}
     * @memberof SessionRestClient
     */
    public async create(sessionJson: AuroraSessionCSV): Promise<AuroraSession> {
        const { data, error } = await supabase
            .from("aurora_sessions")
            .insert(sessionJson)
            .select()
            .single();

        if (error) throw error;

        return new AuroraSession(data as AuroraSessionJson);
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
