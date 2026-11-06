import { strFromU8, unzipSync } from "fflate";
import type { AuroraSession, AuroraSessionDetail } from "../../sdk/models";
import {
    buildSessionCollectionZipFileName,
    buildSessionZip,
    buildSessionZipFileName,
} from "../SessionZipService";

const session = {
    id: "abcd1234efgh",
    sessionAt: Date.UTC(2021, 0, 1, 0, 0, 0),
    sleepScore: 80,
} as unknown as AuroraSession;

const detail = {
    sessionId: "abcd1234efgh",
    streams: [],
    sleepEvents: [
        {
            auroraEventId: 1,
            bins: [],
            eventAt: Date.UTC(2021, 0, 1, 0, 5, 0),
            flags: 0,
            id: 1,
            time: 300000,
        },
    ],
    movementEvents: [],
    stimEvents: [],
    awakeningEvents: [],
    buttonEvents: [],
} as unknown as AuroraSessionDetail;

describe("SessionZipService", () => {
    it("builds a single session ZIP with JSON and CSV", () => {
        const entries = unzipSync(buildSessionZip([{ session, detail }]));

        expect(Object.keys(entries).sort()).toEqual(["events.csv", "session.json"]);

        const json = JSON.parse(strFromU8(entries["session.json"]));
        expect(json.session.id).toBe("abcd1234efgh");
        expect(json.detail.sleepEvents).toHaveLength(1);
        expect(strFromU8(entries["events.csv"])).toContain("sleep,2021-01-01T00:05:00.000Z");
    });

    it("puts each session in its own folder for a collection", () => {
        const entries = unzipSync(buildSessionZip([{ session, detail }], { collection: true }));

        expect(Object.keys(entries).sort()).toEqual([
            "Sessions/20210101-000000_abcd1234/events.csv",
            "Sessions/20210101-000000_abcd1234/session.json",
        ]);
    });

    it("builds readable file names", () => {
        expect(buildSessionZipFileName(session)).toBe("session-20210101-000000-abcd1234.zip");
        expect(buildSessionCollectionZipFileName()).toMatch(/^sessions-\d{8}-\d{6}\.zip$/);
    });
});
