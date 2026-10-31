//#region Import Modules
import type { Aurora } from "./Aurora";

//#endregion

//#region Constants
const UNSUPPORTED_MESSAGE =
    "downloadFile is not supported on native. Use readFile() and persist the content yourself.";
//#endregion

//#region Function
const AuroraCmdDownloadFile = function (
    this: Aurora,
    _srcPath: string,
    _destPath: string,
): Promise<unknown> {
    return Promise.reject(new Error(UNSUPPORTED_MESSAGE));
};
//#endregion

//#region Export
export default AuroraCmdDownloadFile;
//#endregion
