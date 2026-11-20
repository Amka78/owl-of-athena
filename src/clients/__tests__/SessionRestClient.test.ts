import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { AuroraProfile, AuroraSessionCSV, AuroraSessionJson } from "../../sdk/AuroraTypes";
import { AuroraSession } from "../../sdk/models";

/**
 * SessionRestClient は supabase クライアントを直接 import するため、
 * モジュールごと差し替えて実ネットワークを発生させない。
 * 静的 import はモジュール評価順の都合で使わず、テスト内で動的 import する。
 */

const state: {
    tables: string[];
    insertPayload?: Record<string, any>;
} = { tables: [] };

const knownProfiles = new Set(["profile-uuid-123"]);
let profileLookupValue: unknown;

const queryBuilder: any = {
    insert: (payload: any) => {
        state.insertPayload = payload;
        return queryBuilder;
    },
    select: () => queryBuilder,
    eq: (_column: string, value: unknown) => {
        profileLookupValue = value;
        return queryBuilder;
    },
    order: () => queryBuilder,
    single: async () => ({
        data: { ...(state.insertPayload ?? {}), id: "server-session-id" },
        error: null,
    }),
    maybeSingle: async () => ({
        data: knownProfiles.has(String(profileLookupValue)) ? { id: profileLookupValue } : null,
        error: null,
    }),
};

const fakeSupabase = {
    auth: {
        getUser: async () => ({ data: { user: { id: "auth-user-1" } }, error: null }),
    },
    from: (table: string) => {
        state.tables.push(table);
        return queryBuilder;
    },
};

mock.module("../supabase", () => ({ supabase: fakeSupabase }));

const buildSessionJson = (overrides: Partial<AuroraSessionCSV> = {}): AuroraSessionCSV =>
    ({
        type: "csv",
        asleepAt: 1731913200000,
        auroraDir: "sessions/2026-11-19@0455",
        awakeAt: 1731942000000,
        awakening: 3,
        content: "Version: 20500",
        profile: { id: "profile-uuid-123", name: "Deep Sleep" } as AuroraProfile,
        date: 1731912800000,
        duration: 28800000,
        events: [],
        incomplete: false,
        name: "2026-11-19@0455",
        session_txt: "Version: 20500",
        sleepDuration: {
            total: 28000000,
            rem: 5000000,
            unknown: 400000,
            awake: 1000000,
            light: 12000000,
            deep: 9000000,
        },
        sleepOnset: 1234000,
        sleepScore: 87,
        streams: [],
        version: 20500,
        app_platform: "android",
        app_version: 20500,
        ...overrides,
    }) as unknown as AuroraSessionCSV;

describe("SessionRestClient.create", () => {
    beforeEach(() => {
        state.tables = [];
        state.insertPayload = undefined;
        profileLookupValue = undefined;
    });

    it("CSV セッションを構造化カラムへマッピングして INSERT する", async () => {
        const { default: client } = await import("../SessionRestClient");

        const result = await client.create(buildSessionJson());

        // プロフィール解決 → セッション保存の順でアクセスする
        expect(state.tables).toEqual(["aurora_profiles", "aurora_sessions"]);

        const payload = state.insertPayload!;
        expect(payload.user_id).toBe("auth-user-1");
        expect(payload.aurora_profile_id).toBe("profile-uuid-123");
        expect(payload.aurora_profile_name).toBe("Deep Sleep");
        expect(payload.firmware_version).toBe(20500);
        expect(payload.sleep_onset).toBe(1234000);
        expect(payload.session_duration).toBe(28800000);
        expect(payload.sleep_duration).toBe(28000000);
        expect(payload.no_signal_duration).toBe(400000);
        expect(payload.awake_duration).toBe(1000000);
        expect(payload.light_duration).toBe(12000000);
        expect(payload.deep_duration).toBe(9000000);
        expect(payload.rem_duration).toBe(5000000);
        expect(payload.sleep_score).toBe(87);
        expect(payload.incomplete).toBe(false);
        expect(payload.asleep_at).toBe(new Date(1731913200000).toISOString());
        expect(payload.awake_at).toBe(new Date(1731942000000).toISOString());
        expect(payload.session_at).toBe(new Date(1731912800000).toISOString());
        expect(payload.app_platform).toBe("android");
        expect(payload.app_version).toBe(20500);
        expect(payload.session_txt).toBe("Version: 20500");

        // raw CSV のキーが DB に漏れないこと
        expect(payload).not.toHaveProperty("name");
        expect(payload).not.toHaveProperty("auroraDir");
        expect(payload).not.toHaveProperty("content");
        expect(payload).not.toHaveProperty("streams");
        expect(payload).not.toHaveProperty("events");

        // 戻り値は構造化行（type 列なし）として json 分岐でマップされる
        expect(result.id).toBe("server-session-id");
        expect(result.userId).toBe("auth-user-1");
        expect(result.sleepScore).toBe(87);
        expect(String(result.asleepAt)).toBe(new Date(1731913200000).toISOString());
    });

    it("aurora_profiles に無いプロフィール id は NULL（未設定）にして保存を続行する", async () => {
        const { default: client } = await import("../SessionRestClient");

        const result = await client.create(
            buildSessionJson({ profile: { id: "unknown-profile", name: "X" } as AuroraProfile }),
        );

        const payload = state.insertPayload!;
        expect(payload.aurora_profile_id).toBeUndefined();
        expect(payload.aurora_profile_name).toBe("X");
        expect(result.id).toBe("server-session-id");
    });

    it("0 / 不正なタイムスタンプは NULL・小数は整数へ丸める", async () => {
        const { default: client } = await import("../SessionRestClient");

        await client.create(
            buildSessionJson({
                asleepAt: 0,
                awakeAt: 28800000.5,
                duration: 28800000.4,
            }),
        );

        const payload = state.insertPayload!;
        expect(payload.asleep_at).toBeUndefined();
        expect(payload.awake_at).toBe(new Date(28800000.5).toISOString());
        expect(payload.session_duration).toBe(28800000);
    });
});

describe("AuroraSession row mapping", () => {
    it("type 列の無い Supabase 行も構造化カラム（user_id）で json 分岐する", () => {
        const row = new AuroraSession({
            id: "srv-1",
            user_id: "auth-user-1",
            app_platform: "android",
            app_version: 20500,
            incomplete: false,
            sleep_score: 90,
            sleep_onset: 1000,
            sleep_duration: 2000,
        } as unknown as AuroraSessionJson);

        expect(row.userId).toBe("auth-user-1");
        expect(row.sleepScore).toBe(90);
    });

    it("raw CSV セッションは従来どおり csv 分岐でマップされる", () => {
        const csv = new AuroraSession({
            name: "2026-11-19@0455",
            profile: { id: "p1", name: "Deep Sleep" },
            sleepDuration: { total: 28000000 },
            asleepAt: 5,
            awakeAt: 1731942000000,
            type: "csv",
            app_platform: "android",
            app_version: 20500,
            incomplete: false,
        } as unknown as AuroraSessionCSV);

        expect(csv.id).toBe("2026-11-19@0455");
        expect(csv.auroraProfileId).toBe("p1");
    });
});