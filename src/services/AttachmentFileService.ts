//#region Import Modules
import { File } from "expo-file-system";
//#endregion

//#region Functions
/** ネイティブのローカル URI から添付ファイルの内容を読む。 */
export const readAttachmentBytes = async (uri: string): Promise<ArrayBuffer> => {
    return await new File(uri).arrayBuffer();
};
//#endregion
