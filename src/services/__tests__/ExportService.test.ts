import type { AuroraProfile } from "../../sdk/AuroraTypes";
import type { AuroraSession, AuroraSessionDetail } from "../../sdk/models";
import {
    buildProfileExportContent,
    buildSessionEventsCsv,
    buildSessionExportJson,
} from "../ExportService";

const session = {
    id: "session-1",
    userId: "user-1",
    auroraProfileId: "profile-1",
    auroraProfileName: "default.prof",
    appPlatform: "ios",
    appVersion: 1,
    sleepOnset: 1000,
    sessionDuration: 28800000,
    sleepDuration: 25000000,
    noSignalDuration: 0,
    awakeDuration: 1000000,
    lightDuration: 12000000,
    deepDuration: 8000000,
    remDuration: 4000000,
    sleepScore: 80,
    incomplete: false,
    starred: true,
    notes: "note",
    asleepAt: 2000,
    awakeAt: 28000000,
    sessionAt: 1000,
} as AuroraSession;

const detail = {
    sessionId: "session-1",
    streams: [],
    sleepEvents: [{ eventAt: 3000, flags: 2, bins: [], time: 2000, auroraEventId: 1, id: 1 }],
    movementEvents: [{ eventAt: 4000, flags: 1, bins: [], time: 3000, auroraEventId: 2, id: 2 }],
    stimEvents: [{ eventAt: 5000, flags: 3, bins: [], time: 4000, auroraEventId: 3, id: 3 }],
    awakeningEvents: [{ eventAt: 6000, flags: 1, bins: [], time: 5000, auroraEventId: 4, id: 4 }],
    buttonEvents: [{ eventAt: 7000, flags: 1, bins: [], time: 6000, auroraEventId: 5, id: 5 }],
} as AuroraSessionDetail;

describe("ExportService", () => {
    it("builds a JSON export with session and detail", () => {
        const json = JSON.parse(buildSessionExportJson(session, detail));

        expect(json.app).toBe("owl-of-athena");
        expect(json.session.id).toBe("session-1");
        expect(json.session.notes).toBe("note");
        expect(json.detail.sleepEvents).toHaveLength(1);
        expect(json.detail.stimEvents[0].flags).toBe(3);
    });

    it("builds a CSV export sorted by event time", () => {
        const csv = buildSessionEventsCsv(session, detail);
        const lines = csv.split("\r\n");

        expect(lines[0]).toBe("session_id,session-1");
        expect(lines).toContain("sleep,1970-01-01T00:00:03.000Z,2,2000");
        expect(lines).toContain("movement,1970-01-01T00:00:04.000Z,1,3000");
        expect(lines).toContain("stim,1970-01-01T00:00:05.000Z,3,4000");
        expect(lines.indexOf("stim,1970-01-01T00:00:05.000Z,3,4000")).toBeLessThan(
            lines.indexOf("awakening,1970-01-01T00:00:06.000Z,1,5000"),
        );
    });

    it("handles a missing detail", () => {
        const json = JSON.parse(buildSessionExportJson(session, undefined));
        expect(json.detail).toBeNull();

        const csv = buildSessionEventsCsv(session, undefined);
        expect(csv).toContain("type,event_at,flags,time");
    });

    it("returns the raw profile content", () => {
        const profile = { content: "{stim-enabled:1}" } as AuroraProfile;
        expect(buildProfileExportContent(profile)).toBe("{stim-enabled:1}");
        expect(buildProfileExportContent(undefined)).toBe("");
    });
});
