//#region Functions
/** ブラウザのダウンロードとして ZIP を保存する。 */
export const downloadZipFile = async (fileName: string, data: Uint8Array): Promise<void> => {
    const bytes = data.slice();
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
//#endregion
