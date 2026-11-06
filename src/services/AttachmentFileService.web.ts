//#region Functions
/** ブラウザの blob / data URI から添付ファイルの内容を読む。 */
export const readAttachmentBytes = async (uri: string): Promise<ArrayBuffer> => {
    const response = await fetch(uri);
    if (!response.ok) {
        throw new Error("Failed to read the attachment.");
    }
    return await response.arrayBuffer();
};
//#endregion
