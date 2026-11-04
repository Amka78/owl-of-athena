//#region Import Modules
import type { FirmwareRelease } from "../../types";
import { firmwareFlashType, selectFirmwareUpdate, shouldUpdateFirmware } from "../FirmwareService";

//#endregion

const release: FirmwareRelease = {
    version: 10500,
    hexPath: "app.hex",
    notes: "app notes",
    bootloaderVersion: 20200,
    bootloaderHexPath: "bootloader.hex",
    bootloaderHasBootstrap: true,
    bootloaderNotes: "bootloader notes",
    bleVersion: 30300,
    bleHexPath: "ble.hex",
    bleNotes: "ble notes",
};

const installed = {
    app: 10402,
    bootloader: 20100,
    ble: 30200,
};

const getUrl = (path: string): string => `https://example.test/${path}`;

//#region Tests
describe("FirmwareService UnitTest", () => {
    it("returns true when the release is newer than the device", () => {
        expect(shouldUpdateFirmware(10402, 10500)).toBe(true);
    });

    it("returns false when the release is the same version", () => {
        expect(shouldUpdateFirmware(10402, 10402)).toBe(false);
    });

    it("returns false when the release is older than the device", () => {
        expect(shouldUpdateFirmware(10500, 10402)).toBe(false);
    });

    it("returns false when the device version is unknown", () => {
        expect(shouldUpdateFirmware(0, 10500)).toBe(false);
    });

    it("returns false when the release version is invalid", () => {
        expect(shouldUpdateFirmware(10402, 0)).toBe(false);
    });

    it("prefers the application firmware", () => {
        const update = selectFirmwareUpdate(installed, release, getUrl);

        expect(update?.component).toBe("app");
        expect(update?.version).toBe(10500);
        expect(update?.url).toBe("https://example.test/app.hex");
    });

    it("selects the bootloader when the application is current", () => {
        const update = selectFirmwareUpdate({ ...installed, app: 10500 }, release, getUrl);

        expect(update?.component).toBe("bootloader");
        expect(update?.version).toBe(20200);
        expect(update?.url).toBe("https://example.test/bootloader.hex");
        expect(update?.hasBootstrap).toBe(true);
        expect(update?.notes).toBe("bootloader notes");
    });

    it("selects BLE when the application and bootloader are current", () => {
        const update = selectFirmwareUpdate(
            { ...installed, app: 10500, bootloader: 20200 },
            release,
            getUrl,
        );

        expect(update?.component).toBe("ble");
        expect(update?.version).toBe(30300);
        expect(update?.url).toBe("https://example.test/ble.hex");
        expect(update?.notes).toBe("ble notes");
    });

    it("returns undefined when every component is current", () => {
        expect(
            selectFirmwareUpdate({ app: 10500, bootloader: 20200, ble: 30300 }, release, getUrl),
        ).toBeUndefined();
    });

    it("skips a component without a hex path and continues", () => {
        const update = selectFirmwareUpdate(
            { ...installed, app: 10500 },
            { ...release, bootloaderHexPath: undefined },
            getUrl,
        );

        expect(update?.component).toBe("ble");
    });

    it("maps the flash type for bootloader and BLE", () => {
        const bootloader = selectFirmwareUpdate({ ...installed, app: 10500 }, release, getUrl)!;
        const ble = selectFirmwareUpdate(
            { ...installed, app: 10500, bootloader: 20200 },
            release,
            getUrl,
        )!;

        expect(firmwareFlashType(bootloader)).toBe("bootloader-and-bootstrap");
        expect(firmwareFlashType(ble)).toBe("ble");
        expect(firmwareFlashType({ ...ble, component: "app", hasBootstrap: false })).toBe("app");
    });
});
//#endregion
