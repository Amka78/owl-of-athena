//#region Import Modules
import type { Aurora } from "./Aurora";

//#endregion

//#region Constants
const UNSUPPORTED_MESSAGE =
    "uploadFile is not supported on native yet. Firmware update over Bluetooth needs a native file source.";
//#endregion

//#region Function
const AuroraCmdUploadFile = function (
    this: Aurora,
    _srcPath: string,
    _destPath: string,
    _rename: boolean = false,
): Promise<unknown> {
    return Promise.reject(new Error(UNSUPPORTED_MESSAGE));
};
//#endregion

//#region Export
export default AuroraCmdUploadFile;
//#endregion
