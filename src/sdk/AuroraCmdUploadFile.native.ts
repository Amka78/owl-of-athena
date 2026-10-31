//#region Import Modules
import type { Aurora } from "./Aurora";

//#endregion

//#region Constants
const LOCAL_PATH_MESSAGE =
    "uploadFile from a local path is not supported on native. Pass an https URL instead.";
//#endregion

//#region Function
const AuroraCmdUploadFile = async function (
    this: Aurora,
    srcPath: string,
    destPath: string,
    rename: boolean = false,
): Promise<unknown> {
    if (!/^https?:\/\//i.test(srcPath)) {
        throw new Error(LOCAL_PATH_MESSAGE);
    }

    const response = await fetch(srcPath);
    if (!response.ok) {
        throw new Error(`Failed to download ${srcPath}: ${response.status}`);
    }

    // ファームウェアの hex はテキストなので、文字列のまま書き込める
    const content = await response.text();
    return await this.writeFile(destPath, content, rename);
};
//#endregion

//#region Export
export default AuroraCmdUploadFile;
//#endregion
