//#region Import Modules
import * as FileSystem from "expo-file-system/legacy";
import type { FirmwareDownloadProgress } from "../types";
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
    onDownloadProgress?: (progress: FirmwareDownloadProgress) => void,
    onDownloadComplete?: () => void,
): Promise<unknown> {
    if (!/^https?:\/\//i.test(srcPath)) {
        throw new Error(LOCAL_PATH_MESSAGE);
    }
    if (!FileSystem.cacheDirectory) {
        throw new Error("Cache directory is unavailable.");
    }

    const target = `${FileSystem.cacheDirectory}firmware-${Date.now()}.hex`;
    const download = FileSystem.createDownloadResumable(srcPath, target, {}, (progress) => {
        onDownloadProgress?.({
            loaded: progress.totalBytesWritten,
            total:
                progress.totalBytesExpectedToWrite > 0
                    ? progress.totalBytesExpectedToWrite
                    : undefined,
        });
    });

    const result = await download.downloadAsync();
    if (!result || result.status < 200 || result.status >= 300) {
        throw new Error(
            `Failed to download ${srcPath}: ${result?.status ?? "no response"}`,
        );
    }

    try {
        // ファームウェアの hex はテキストなので、文字列のまま書き込める
        const content = await FileSystem.readAsStringAsync(result.uri);
        onDownloadComplete?.();
        return await this.writeFile(destPath, content, rename);
    } finally {
        await FileSystem.deleteAsync(result.uri, { idempotent: true }).catch(() => undefined);
    }
};
//#endregion

//#region Export
export default AuroraCmdUploadFile;
//#endregion
