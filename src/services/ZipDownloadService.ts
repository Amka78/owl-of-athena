//#region Import Modules
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

//#endregion

//#region Functions
const toBase64 = (data: Uint8Array): string => {
    let binary = "";
    for (let index = 0; index < data.length; index += 1) {
        binary += String.fromCharCode(data[index]);
    }
    return btoa(binary);
};

/** ZIP をキャッシュへ書き出し、OS の共有シートを開く。 */
export const downloadZipFile = async (fileName: string, data: Uint8Array): Promise<void> => {
    const directory = FileSystem.cacheDirectory;
    if (!directory) {
        throw new Error("Cache directory is unavailable.");
    }
    const uri = `${directory}${fileName}`;
    await FileSystem.writeAsStringAsync(uri, toBase64(data), {
        encoding: FileSystem.EncodingType.Base64,
    });

    if (!(await Sharing.isAvailableAsync())) {
        throw new Error("Sharing is not available on this device.");
    }
    await Sharing.shareAsync(uri, {
        mimeType: "application/zip",
        UTI: "public.zip-archive",
        dialogTitle: fileName,
    });
};
//#endregion
