//#region Import Modules
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuroraInstance } from "../../sdk";
import { ConnectionStates } from "../../sdk/AuroraConstants";
import { AuroraEventList } from "../../sdk/AuroraEventList";
import { clear, getEntries, subscribe } from "../AuroraCommLog";

//#endregion

//#region Helpers
const emitCmdBegin = (command: string, args: string[] = []): void => {
    AuroraInstance.emit(AuroraEventList.cmdBegin, { command, args });
};

const emitCmdEnd = (
    command: string,
    args: string[] = [],
    overrides: Record<string, unknown> = {},
): void => {
    AuroraInstance.emit(AuroraEventList.cmdEnd, {
        command,
        args,
        beginTime: 1000,
        endTime: 1032,
        error: false,
        response: {},
        ...overrides,
    });
};
//#endregion

//#region Tests
describe("AuroraCommLog", () => {
    beforeEach(() => {
        clear();
    });

    it("starts empty", () => {
        expect(getEntries()).toHaveLength(0);
    });

    it("records sent commands and OK responses", () => {
        emitCmdBegin("os-info", ["1"]);
        emitCmdEnd("os-info", ["1"]);

        const entries = getEntries();
        expect(entries).toHaveLength(2);
        expect(entries[0]).toMatchObject({ kind: "send", text: "os-info 1" });
        expect(entries[0].detail).toBeUndefined();
        expect(entries[1]).toMatchObject({
            kind: "recv",
            text: "os-info 1",
            detail: "OK 32ms",
            failed: false,
        });
    });

    it("marks failed responses with the error code", () => {
        emitCmdBegin("prof-load", ["Community Sleep"]);
        emitCmdEnd("prof-load", ["Community Sleep"], {
            error: true,
            response: { error: 3 },
        });

        const entries = getEntries();
        expect(entries[1]).toMatchObject({
            kind: "recv",
            text: "prof-load Community Sleep",
            detail: "error 3",
            failed: true,
        });
    });

    it("uses FAILED when the response has no error code", () => {
        emitCmdEnd("os-flash", [], { error: true, response: { message: "fatal" } });

        expect(getEntries()[0]).toMatchObject({ detail: "FAILED", failed: true });
    });

    it("records bluetooth connection state changes", () => {
        AuroraInstance.emit(AuroraEventList.bluetoothConnectionChange, ConnectionStates.CONNECTING);

        expect(getEntries()[0]).toMatchObject({
            kind: "conn",
            text: "bluetooth",
            detail: "CONNECTING",
        });
    });

    it("notifies subscribers with a snapshot on each entry", () => {
        const listener = vi.fn();
        const unsubscribe = subscribe(listener);

        emitCmdBegin("sync-time");

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener.mock.calls[0][0]).toHaveLength(1);

        unsubscribe();

        emitCmdEnd("sync-time");

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it("keeps at most MAX_ENTRIES and drops the oldest", () => {
        for (let i = 0; i < 105; i++) {
            emitCmdBegin(`cmd-${i}`);
        }

        const entries = getEntries();
        expect(entries).toHaveLength(100);
        expect(entries[0].text).toBe("cmd-5");
        expect(entries[99].text).toBe("cmd-104");
    });
});
//#endregion
