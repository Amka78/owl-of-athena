import LogService, { formatLogEntries } from "../LogService";

describe("LogService", () => {
    let uninstall: (() => void) | undefined;

    afterEach(() => {
        uninstall?.();
        uninstall = undefined;
        LogService.clear();
    });

    it("captures console output with levels and params", () => {
        uninstall = LogService.install();

        console.warn("alarm failed", { code: 1 });
        console.debug("connecting");

        const logs = LogService.getLogs();

        expect(logs).toHaveLength(2);
        expect(logs[0].type).toBe("warning");
        expect(logs[0].message).toBe("alarm failed");
        expect(logs[0].params).toEqual([{ code: 1 }]);
        expect(logs[1].type).toBe("debug");
        expect(logs[1].message).toBe("connecting");
    });

    it("stops capturing after uninstall", () => {
        uninstall = LogService.install();
        uninstall();
        uninstall = undefined;

        console.info("after uninstall");

        expect(LogService.getLogs()).toHaveLength(0);
    });

    it("formats entries as one line per log", () => {
        const text = formatLogEntries([
            {
                type: "error",
                message: "flash failed",
                params: [{ code: 2 }, "retry"],
                time: new Date("2026-11-04T00:00:00.000Z").getTime(),
                delta: 0,
            },
        ]);

        expect(text).toBe(
            '2026-11-04T00:00:00.000Z [ERROR] flash failed {"code":2} retry',
        );
    });
});