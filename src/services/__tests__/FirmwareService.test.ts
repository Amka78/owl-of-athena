//#region Import Modules
import { shouldUpdateFirmware } from "../FirmwareService";

//#endregion

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
});
//#endregion
