import { describe, expect, it } from "vitest";
import type { AuroraEventJson } from "../../AuroraTypes";
import { AuroraEvent } from "../AuroraEvent";

describe("AuroraEvent", () => {
    it("CSV 由来イベント（date のみ・event_at 無し）は eventAt に date をフォールバックする", () => {
        const csvEvent = new AuroraEvent({
            aurora_event_id: 1,
            bins: [],
            event_at: undefined as unknown as number,
            date: 1731912810000,
            flags: 2,
            id: 1,
            time: 10000,
        } as AuroraEventJson);

        expect(csvEvent.eventAt).toBe(1731912810000);
        expect(csvEvent.time).toBe(10000);
        expect(csvEvent.flags).toBe(2);
    });

    it("サーバ由来イベントは event_at をそのまま使う", () => {
        const serverEvent = new AuroraEvent({
            aurora_event_id: 2,
            bins: [],
            event_at: 1731912820000,
            flags: 1,
            id: 2,
            time: 20000,
        } as AuroraEventJson);

        expect(serverEvent.eventAt).toBe(1731912820000);
    });
});
