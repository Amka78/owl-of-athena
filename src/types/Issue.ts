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
    created_at?: string;
};

export type CreateIssue = Omit<Issue, "id" | "platform" | "version" | "status" | "attachment_url" | "created_at">;
