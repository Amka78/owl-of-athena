import { describe, expect, test } from "bun:test";

import { EventIds } from "../../AuroraConstants";
import { VirtualAuroraDevice } from "../../virtual/VirtualAuroraDevice";

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe("VirtualAuroraDevice", () => {
    test("os-info がオブジェクト応答を返す", () => {
        const device = new VirtualAuroraDevice({ osVersion: 30000 });
        const resp = device.execute("os-info 1");

        expect(resp.kind).toBe("object");
        if (resp.kind === "object") {
            const text = resp.lines.join("\n");
            expect(text).toContain("Version        : 30000");
            expect(text).toContain("Battery Level  : 100%");
            expect(text).toContain("Profile        : None");
        }
    });

    test("clock-set / log-* / prof-load / prof-unload は plain 応答", () => {
        const device = new VirtualAuroraDevice();

        expect(device.execute("clock-set 2026 11 16 1000").kind).toBe("plain");
        expect(device.execute("log-level-display").kind).toBe("plain");
        expect(device.execute("log-output-display").kind).toBe("plain");
        expect(device.execute("prof-load default.prof").kind).toBe("plain");
        expect(device.execute("prof-unload").kind).toBe("plain");
    });

    test("未知コマンドは error 応答", () => {
        const device = new VirtualAuroraDevice();
        const resp = device.execute("help");

        expect(resp.kind).toBe("error");
        if (resp.kind === "error") {
            expect(resp.message).toContain("help");
        }
    });

    test("存在しないディレクトリの sd-dir-read は空テーブルを返す", () => {
        const device = new VirtualAuroraDevice();
        const resp = device.execute("sd-dir-read nonexistent-dir 1");

        expect(resp.kind).toBe("table");
        if (resp.kind === "table") {
            expect(resp.columns).toEqual(["name", "isFile", "size"]);
            expect(resp.rows).toEqual([]);
        }
    });

    test("event-output-enable でバッテリーイベントが発火する", async () => {
        const device = new VirtualAuroraDevice();
        let emitted: [number, number] | undefined;
        device.on("deviceEvent", (eventId: number, flags: number) => {
            emitted = [eventId, flags];
        });

        device.execute(`event-output-enable ${1 << EventIds.BATTERY_MONITOR} 16`);
        await wait(300);

        expect(emitted).toEqual([EventIds.BATTERY_MONITOR, 100]);
    });

    test("sd-file-write の入力が完了すると writeFinished とファイル保存が起きる", async () => {
        const device = new VirtualAuroraDevice();
        const finished: Array<{ kind: string; lines: string[] }> = [];
        device.on("writeFinished", (resp) => {
            finished.push(resp);
        });

        const resp = device.execute("sd-file-write profiles/foo.prof / 0 1 500 0 }");
        expect(resp.kind).toBe("input");

        device.writeInput(Buffer.from("hello virtual device"));
        await wait(700);

        expect(finished.length).toBe(1);
        expect(finished[0].kind).toBe("object");
        expect(device.getFile("profiles/foo.prof")?.toString()).toBe("hello virtual device");
    });

    test("sd-file-read が非圧縮コンテンツをチャンクで返す", () => {
        const device = new VirtualAuroraDevice();
        device.setFile("profiles/default.prof", "profile content");

        const resp = device.execute("sd-file-read default.prof profiles 0");
        expect(resp.kind).toBe("output");
        if (resp.kind === "output") {
            expect(Buffer.concat(resp.chunks).toString()).toBe("profile content");
            expect(resp.infoLines.join("\n")).toContain("crc:");
        }
    });

    test("sd-dir-read がファイル・サブディレクトリを一覧する", () => {
        const device = new VirtualAuroraDevice();
        // サンプルセッション（前日・前々日）と重ならない日時を使う
        device.setFile("sessions/2099-01-01@0000/session.txt", "x".repeat(100));
        device.setFile("sessions/2099-01-01@0000/stream1.dat", "y".repeat(50));
        device.setFile("sessions/2099-01-02@0000/session.txt", "z".repeat(100));

        const dirs = device.execute("sd-dir-read sessions 0");

        expect(dirs.kind).toBe("table");
        if (dirs.kind === "table") {
            // サンプルセッション 2 件 + 追加分 2 件が一覧される
            expect(dirs.rows.length).toBeGreaterThanOrEqual(4);
            expect(dirs.rows).toContainEqual(["2099-01-01@0000", false, 0]);
            expect(dirs.rows).toContainEqual(["2099-01-02@0000", false, 0]);
        }

        const files = device.execute("sd-dir-read 2099-01-01@0000 1");
        expect(files.kind).toBe("table");
        if (files.kind === "table") {
            expect(files.rows).toEqual([
                ["session.txt", true, 100],
                ["stream1.dat", true, 50],
            ]);
        }
    });

    test("sd-rename と sd-dir-del が反映される", () => {
        const device = new VirtualAuroraDevice();
        device.setFile("profiles/a.prof", "a");
        device.setFile("profiles/b.prof", "b");

        device.execute("sd-rename profiles/a.prof profiles/c.prof");
        expect(device.getFile("profiles/a.prof")).toBeUndefined();
        expect(device.getFile("profiles/c.prof")?.toString()).toBe("a");

        device.execute("sd-dir-del profiles");
        expect(device.getFile("profiles/b.prof")).toBeUndefined();
    });
});
