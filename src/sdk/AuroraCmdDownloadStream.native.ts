//#region Import Modules
import type { Aurora } from "./Aurora";
import type { ConnectorTypes, DataTypes } from "./AuroraConstants";

//#endregion

//#region Constants
const UNSUPPORTED_MESSAGE =
    "downloadStream is not supported on native. Use readFile() and persist the content yourself.";
//#endregion

//#region Function
const AuroraCmdDownloadStream = function (
    this: Aurora,
    _srcPath: string,
    _destDir: string,
    _type: DataTypes,
    _connector: ConnectorTypes,
): Promise<unknown> {
    return Promise.reject(new Error(UNSUPPORTED_MESSAGE));
};
//#endregion

//#region Export
export default AuroraCmdDownloadStream;
//#endregion
