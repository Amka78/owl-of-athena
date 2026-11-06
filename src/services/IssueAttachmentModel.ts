//#region Constants
export const MAX_ISSUE_ATTACHMENTS = 5;
export const MAX_ISSUE_ATTACHMENT_BYTES = 10 * 1024 * 1024;
//#endregion

//#region Functions
export const sanitizeAttachmentName = (fileName: string): string => {
    const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/^\.+/, "");
    return sanitized.slice(-80) || "attachment";
};

/** 自分のフォルダ配下に置く。管理者は全件、本人は自分のフォルダだけ読める。 */
export const buildAttachmentStoragePath = (
    userId: string,
    fileName: string,
    uniqueId: string,
): string => {
    return `${userId}/${uniqueId}-${sanitizeAttachmentName(fileName)}`;
};

export const isAttachmentSizeAllowed = (size?: number): boolean => {
    return size === undefined || size <= MAX_ISSUE_ATTACHMENT_BYTES;
};
//#endregion
