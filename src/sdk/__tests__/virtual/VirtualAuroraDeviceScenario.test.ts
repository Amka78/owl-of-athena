import { describe, expect, test } from "bun:test";
import { HeatshrinkDecoder } from "heatshrink-ts";

import { EventIds } from "../../AuroraConstants";
import AuroraSessionReader from "../../AuroraSessionReader";
import { VirtualAuroraDevice } from "../../virtual/VirtualAuroraDevice";

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe("VirtualAuroraDevice セッション・就寝シナリオ", () => {
    test("サンプルセッションが 2 件、*@* フィルタで一覧される", () => {
        const device = new VirtualAuroraDevice();
        const resp = device.execute("sd-dir-read sessions 0 *@*");

        expect(resp.kind).toBe("table");
        if (resp.kind === "table") {
            expect(resp.rows.length).toBe(2);
            for (const row of resp.rows) {
                expect(String(row[0])).toMatch(/^\d{4}-\d{2}-\d{2}@\d{4}$/);
                expect(row[1]).toBe(false);
            }
        }
    });

    test("サンプルセッションの session.txt が圧縮読み取りで取得でき、パーサを通る", async () => {
        const device = new VirtualAuroraDevice();

        const dirs = device.execute("sd-dir-read sessions 0 *@*");
        if (dirs.kind !== "table") throw new Error("unexpected response");
        const firstDir = String(dirs.rows[0][0]);

        // sd-file-read（compress=1）→ heatshrink 復号 → AuroraSessionReader.read まで通す
        const read = device.execute(`sd-file-read session.txt ${firstDir} 1`);
        expect(read.kind).toBe("output");
        if (read.kind !== "output") return;

        const encoded = Buffer.concat(read.chunks);
        const decoder = new HeatshrinkDecoder(8, 4, encoded.byteLength);
        decoder.process(encoded);
        const sessionTxt = new TextDecoder().decode(decoder.getOutput());
        expect(sessionTxt.length).toBeGreaterThan(75);

        const dirFiles = device.execute(`sd-dir-read ${firstDir} 1`);
        const session = await AuroraSessionReader.read(
            `sessions/${firstDir}`,
            sessionTxt,
            dirFiles.kind === "table"
                ? dirFiles.rows.map((row) => ({
                      name: String(row[0]),
                      isFile: Boolean(row[1]),
                      size: Number(row[2]),
                  }))
                : undefined,
        );

        expect(session.name).toBe(firstDir);
        expect(session.version).toBe(30000);
        expect(session.profile).toBe("default.prof");
        expect(session.events.length).toBeGreaterThan(0);
    });

    test("就寝シナリオ（短縮モード）でアラーム→ボタン押下イベントが順に発火する", async () => {
        const emitted: Array<{ eventId: number; flags: number }> = [];
        const device = new VirtualAuroraDevice({
            sleepScenarioSeconds: 1,
            buttonPressDelayMs: 100,
        });
        device.on("deviceEvent", (eventId: number, flags: number) => {
            emitted.push({ eventId, flags });
        });

        device.execute("prof-load default.prof");
        await wait(1400);

        expect(emitted[0]?.eventId).toBe(EventIds.CLOCK_ALARM_FIRE);
        await wait(300);
        expect(emitted[1]?.eventId).toBe(EventIds.BUTTON_MONITOR);
        expect(emitted[1]?.flags).toBe(1);
    });

    test("prof-unload で就寝シナリオがキャンセルされる", async () => {
        const emitted: Array<{ eventId: number }> = [];
        const device = new VirtualAuroraDevice({ sleepScenarioSeconds: 1 });
        device.on("deviceEvent", (eventId: number) => {
            emitted.push({ eventId });
        });

        device.execute("prof-load default.prof");
        device.execute("prof-unload");
        await wait(1200);

        expect(emitted.length).toBe(0);
    });

    test("就寝シナリオ完了でその晩のセッションが生成され、パーサを通る", async () => {
        const device = new VirtualAuroraDevice({
            sleepScenarioSeconds: 1,
            buttonPressDelayMs: 50,
        });

        device.execute("prof-load default.prof");
        await wait(1400);

        // サンプル 2 件 + 就寝分の 1 件が一覧される
        const dirs = device.execute("sd-dir-read sessions 0 *@*");
        expect(dirs.kind).toBe("table");
        if (dirs.kind !== "table") return;
        expect(dirs.rows.length).toBe(3);

        // 生成されたのは「今日」の日時ディレクトリ
        const today = new Date();
        const todayPrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const newDir = dirs.rows.find((row) => String(row[0]).startsWith(todayPrefix));
        expect(newDir).toBeDefined();
        const dirName = String(newDir![0]);

        // sd-file-read（compress=1）→ heatshrink 復号 → AuroraSessionReader.read まで通す
        const read = device.execute(`sd-file-read session.txt ${dirName} 1`);
        expect(read.kind).toBe("output");
        if (read.kind !== "output") return;

        const encoded = Buffer.concat(read.chunks);
        const decoder = new HeatshrinkDecoder(8, 4, encoded.byteLength);
        decoder.process(encoded);
        const sessionTxt = new TextDecoder().decode(decoder.getOutput());
        expect(sessionTxt.length).toBeGreaterThan(75);

        const dirFiles = device.execute(`sd-dir-read ${dirName} 1`);
        const session = await AuroraSessionReader.read(
            `sessions/${dirName}`,
            sessionTxt,
            dirFiles.kind === "table"
                ? dirFiles.rows.map((row) => ({
                      name: String(row[0]),
                      isFile: Boolean(row[1]),
                      size: Number(row[2]),
                  }))
                : undefined,
        );

        expect(session.name).toBe(dirName);
        expect(session.profile).toBe("default.prof");
        expect(session.events.length).toBeGreaterThan(0);
    });

    test("wakeup-time を書き込んだプロフィールから起床時刻を読める（実時間モード）", async () => {
        const device = new VirtualAuroraDevice();
        const finished: Array<{ kind: string }> = [];
        device.on("writeFinished", (resp) => {
            finished.push(resp);
        });

        // アラームは 1 時間以内に来る wakeup-time（現在時刻 + 30 分）に設定される
        const in30Min = new Date(Date.now() + 30 * 60 * 1000);
        const wakeupMs =
            in30Min.getHours() * 3600000 +
            in30Min.getMinutes() * 60000 +
            in30Min.getSeconds() * 1000 +
            in30Min.getMilliseconds();

        const profile = `stream-config 18 19 {stim-enabled:0}\nwakeup-time-val {wakeup-time:${wakeupMs}}\n`;
        device.execute("sd-file-write profiles/default.prof / 0 1 500 0 }");
        device.writeInput(Buffer.from(profile));
        await wait(700);
        expect(finished.length).toBe(1);
    });
});
