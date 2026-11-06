export type Issue = {
    id: string;
    title: string;
    description?: string;
    reproduce_steps?: string;
    critical: boolean;
    anonymous: boolean;
    platform?: string;
    version?: string;
    status?: string;
    attachment_url?: string;
    logs?: string;
    created_at?: string;
};

export type CreateIssue = Omit<
    Issue,
    "id" | "platform" | "version" | "status" | "attachment_url" | "created_at"
>;

/** 送信前に選択した添付ファイル。 */
export type IssueAttachmentInput = {
    uri: string;
    name: string;
    contentType: string;
    size?: number;
};

export type IssueAttachment = {
    id: string;
    issue_id: string;
    storage_path: string;
    file_name: string;
    content_type?: string;
    size_bytes?: number;
    created_at?: string;
};

export type IssueAttachmentWithUrl = IssueAttachment & {
    url?: string;
};
