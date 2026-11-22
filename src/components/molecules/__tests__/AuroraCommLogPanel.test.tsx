//#region Import Modules
import { render } from "@testing-library/react-native";
import { describe, expect, it } from "vitest";
import type { AuroraCommLogEntry } from "../../../services/AuroraCommLog";
import { AuroraCommLogPanel } from "../AuroraCommLogPanel";

//#endregion

//#region Helpers
const entry = (
    overrides: Partial<AuroraCommLogEntry> & Pick<AuroraCommLogEntry, "kind" | "text">,
): AuroraCommLogEntry => ({
    id: 1,
    at: new Date(2026, 0, 1, 21, 3, 12).getTime(),
    ...overrides,
});
//#endregion

//#region Tests
describe("AuroraCommLogPanel", () => {
    it("shows the waiting message when there is no history", () => {
        const { getByText } = render(<AuroraCommLogPanel entries={[]} />);

        expect(getByText("Waiting for communication…")).toBeTruthy();
    });

    it("renders send, recv and connection entries with their status", () => {
        const entries: AuroraCommLogEntry[] = [
            entry({ kind: "send", text: "sd-dir-read sessions" }),
            entry({
                id: 2,
                at: new Date(2026, 0, 1, 21, 3, 13).getTime(),
                kind: "recv",
                text: "sd-dir-read sessions",
                detail: "OK 24ms",
            }),
            entry({
                id: 3,
                at: new Date(2026, 0, 1, 21, 3, 14).getTime(),
                kind: "conn",
                text: "bluetooth",
                detail: "CONNECTED",
            }),
        ];

        const { getByText } = render(<AuroraCommLogPanel entries={entries} />);

        expect(getByText("AURORA")).toBeTruthy();
        expect(getByText("21:03:12")).toBeTruthy();
        expect(getByText("sd-dir-read sessions  ·  OK 24ms")).toBeTruthy();
        expect(getByText("bluetooth  ·  CONNECTED")).toBeTruthy();
    });

    it("marks failed entries with the failure icon", () => {
        const entries: AuroraCommLogEntry[] = [
            entry({
                kind: "recv",
                text: "prof-load test",
                detail: "error 3",
                failed: true,
            }),
        ];

        const { getByText } = render(<AuroraCommLogPanel entries={entries} />);

        expect(getByText("✗")).toBeTruthy();
        expect(getByText("prof-load test  ·  error 3")).toBeTruthy();
    });
});
//#endregion
