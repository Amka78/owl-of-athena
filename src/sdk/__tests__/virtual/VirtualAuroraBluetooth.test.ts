import { describe, expect, test } from "vitest";

import { DeviceEventList, EventIds } from "../../AuroraConstants";
import { VirtualAuroraBluetooth } from "../../virtual/VirtualAuroraBluetooth";

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe("VirtualAuroraBluetooth", () => {
    test("connect で接続状態になり、isConnected が true になる", async () => {
        const bt = new VirtualAuroraBluetooth();
        expect(bt.isConnected()).toBe(false);

        await bt.connect(500);
        expect(bt.isConnected()).toBe(true);
        expect(bt.isConnecting()).toBe(false);
    });

    test("接続中に connect すると拒否される", async () => {
        const bt = new VirtualAuroraBluetooth();
        await bt.connect(500);

        await expect(bt.connect(500)).rejects.toBe("Already connected.");
    });

    test("os-info 1 がパーサ経由のオブジェクト応答として返る", async () => {
        const bt = new VirtualAuroraBluetooth();
        await bt.connect(500);

        const result: any = await bt.writeCmd("os-info 1");

        expect(result.error).toBe(false);
        expect(result.origin).toBe("bluetooth");
        expect(result.response.version).toBe(99900);
        expect(result.response.batteryLevel).toBe(100);
        // "Profile : None" は parseValueString で false に変換される
        expect(result.response.profile).toBe(false);
    });

    test("event-output-enable 後にバッテリーイベントがアプリ側へ流れる", async () => {
        const bt = new VirtualAuroraBluetooth();
        await bt.connect(500);

        const events: Array<{ eventId: number; flags: number }> = [];
        bt.on(DeviceEventList.auroraEvent, (auroraEvent) => {
            events.push(auroraEvent as { eventId: number; flags: number });
        });

        await bt.writeCmd(`event-output-enable ${1 << EventIds.BATTERY_MONITOR} 16`);
        await wait(300);

        expect(events.length).toBe(1);
        expect(events[0].eventId).toBe(EventIds.BATTERY_MONITOR);
        expect(events[0].flags).toBe(100);
    });

    test("sd-file-write は入力を待ち、完了後に crc を含むオブジェクト応答を返す", async () => {
        const bt = new VirtualAuroraBluetooth();
        await bt.connect(500);

        const writePromise = bt.writeCmd("sd-file-write profiles/bar.prof / 0 1 500 0 }");
        await bt.writeCmdInput(Buffer.from("0123456789abcdef"));
        const result: any = await writePromise;

        expect(result.error).toBe(false);
        expect(typeof result.response.crc).toBe("number");
        expect(result.response.file).toBe("profiles/bar.prof");
    });

    test("存在しないディレクトリの sd-dir-read は空テーブル応答を返す", async () => {
        const bt = new VirtualAuroraBluetooth();
        await bt.connect(500);

        const result: any = await bt.writeCmd("sd-dir-read nonexistent-dir 1");

        expect(result.error).toBe(false);
        expect(result.response).toEqual([]);
    });

    test("未知コマンドは error 応答になる", async () => {
        const bt = new VirtualAuroraBluetooth();
        await bt.connect(500);

        const result: any = await bt.writeCmd("help");
        expect(result.error).toBe(true);
    });

    test("disconnect で接続状態が解除される", async () => {
        const bt = new VirtualAuroraBluetooth();
        await bt.connect(500);

        await bt.disconnect();
        expect(bt.isConnected()).toBe(false);
    });
});
