import { AuroraOSInfo } from "../AuroraOSInfo";

describe("AuroraOSInfo UnitTest", () => {
    it("keeps the os-info build date, storage and running time", () => {
        const info = new AuroraOSInfo({
            version: 10001,
            bootloaderVersion: 1,
            bleVersion: 2,
            bootstrapVersion: 3,
            batteryLevel: 87,
            buildDate: Date.UTC(2017, 0, 1, 5, 5, 5),
            bytesFree: 5555,
            runningTime: "5.20 h",
        });

        expect(info.buildDate).toBe(Date.UTC(2017, 0, 1, 5, 5, 5));
        expect(info.bytesFree).toBe(5555);
        expect(info.runningTime).toBe("5.20 h");
        expect(info.batteryLevel).toBe(87);
    });

    it("leaves optional os-info fields undefined when absent", () => {
        const info = new AuroraOSInfo({ version: 10001 });

        expect(info.buildDate).toBeUndefined();
        expect(info.bytesFree).toBeUndefined();
        expect(info.runningTime).toBeUndefined();
    });
});
