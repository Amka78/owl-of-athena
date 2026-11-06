import {
    buildAttachmentStoragePath,
    isAttachmentSizeAllowed,
    MAX_ISSUE_ATTACHMENT_BYTES,
    sanitizeAttachmentName,
} from "../IssueAttachmentModel";

describe("IssueAttachmentModel", () => {
    it("sanitizes file names for storage paths", () => {
        expect(sanitizeAttachmentName("../../evil name.png")).toBe("_.._evil_name.png");
        expect(sanitizeAttachmentName("")).toBe("attachment");
    });

    it("puts attachments under the user's folder", () => {
        expect(buildAttachmentStoragePath("user-1", "shot 1.png", "abc")).toBe(
            "user-1/abc-shot_1.png",
        );
    });

    it("allows files up to 10 MB", () => {
        expect(isAttachmentSizeAllowed(MAX_ISSUE_ATTACHMENT_BYTES)).toBe(true);
        expect(isAttachmentSizeAllowed(MAX_ISSUE_ATTACHMENT_BYTES + 1)).toBe(false);
        expect(isAttachmentSizeAllowed(undefined)).toBe(true);
    });
});
