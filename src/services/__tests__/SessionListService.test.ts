import type { Moment } from "moment";
import type { AuroraSession } from "../../sdk/models";
import { buildSessionListRows } from "../SessionListService";

const session = (id: string, sessionAt: string): AuroraSession =>
    ({ id, sessionAt }) as AuroraSession;

const formatMonth = (sessionAt: Moment): string => sessionAt.format("YYYY-MM");

describe("SessionListService", () => {
    it("inserts a month header when the month changes", () => {
        const rows = buildSessionListRows(
            [
                session("a", "2026-11-05T23:00:00Z"),
                session("b", "2026-11-01T23:00:00Z"),
                session("c", "2026-10-31T23:00:00Z"),
            ],
            formatMonth,
        );

        expect(rows.map((row) => row.type)).toEqual([
            "month",
            "session",
            "session",
            "month",
            "session",
        ]);
        expect(rows[0]).toMatchObject({ type: "month", label: "2026-11" });
        expect(rows[3]).toMatchObject({ type: "month", label: "2026-10" });
    });

    it("keeps the session order inside each month", () => {
        const rows = buildSessionListRows(
            [session("a", "2026-11-05T23:00:00Z"), session("b", "2026-11-01T23:00:00Z")],
            formatMonth,
        );

        expect(rows.filter((row) => row.type === "session").map((row) => row.key)).toEqual([
            "a",
            "b",
        ]);
    });

    it("returns no rows for an empty list", () => {
        expect(buildSessionListRows([], formatMonth)).toEqual([]);
    });
});
