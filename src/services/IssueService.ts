import Constants from "expo-constants";
import { Platform } from "react-native";
import { supabase } from "../clients/supabase";
import type {
    CreateIssue,
    Issue,
    IssueAttachment,
    IssueAttachmentInput,
    IssueAttachmentWithUrl,
} from "../types";
import {
    buildAttachmentStoragePath,
    isAttachmentSizeAllowed,
    MAX_ISSUE_ATTACHMENT_BYTES,
    MAX_ISSUE_ATTACHMENTS,
} from "./IssueAttachmentModel";

const ATTACHMENT_BUCKET = "issue-attachments";

const uniqueId = (): string => {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
};

class IssueService {
    async createIssue(
        issueData: CreateIssue,
        attachments: IssueAttachmentInput[] = [],
    ): Promise<Issue> {
        const version = Constants.expoConfig?.version ?? "unknown";
        const platform = Platform.OS;

        if (attachments.length > MAX_ISSUE_ATTACHMENTS) {
            throw new Error(`Up to ${MAX_ISSUE_ATTACHMENTS} attachments are allowed.`);
        }

        const { data: authData } = await supabase.auth.getUser();
        const userId = authData.user?.id;
        if (attachments.length > 0 && userId === undefined) {
            throw new Error("Authentication is required to attach files.");
        }

        const uploaded: Omit<IssueAttachment, "id" | "issue_id" | "created_at">[] = [];
        for (const file of attachments) {
            if (!isAttachmentSizeAllowed(file.size)) {
                throw new Error("Attachment is too large (max 10 MB).");
            }

            const { readAttachmentBytes } = await import("./AttachmentFileService");
            const bytes = await readAttachmentBytes(file.uri);
            if (bytes.byteLength > MAX_ISSUE_ATTACHMENT_BYTES) {
                throw new Error("Attachment is too large (max 10 MB).");
            }

            const storagePath = buildAttachmentStoragePath(
                userId ?? "anonymous",
                file.name,
                uniqueId(),
            );
            const { error } = await supabase.storage
                .from(ATTACHMENT_BUCKET)
                .upload(storagePath, bytes, {
                    contentType: file.contentType || "application/octet-stream",
                    upsert: false,
                });
            if (error) throw error;

            uploaded.push({
                storage_path: storagePath,
                file_name: file.name,
                content_type: file.contentType,
                size_bytes: bytes.byteLength,
            });
        }

        const { data, error } = await supabase
            .from("issues")
            .insert({
                ...issueData,
                user_id: userId ?? null,
                platform,
                version,
                status: "open",
            })
            .select()
            .single();

        if (error) throw error;

        if (uploaded.length > 0) {
            const { error: attachmentError } = await supabase.from("issue_attachments").insert(
                uploaded.map((item) => ({
                    ...item,
                    issue_id: data.id,
                })),
            );
            if (attachmentError) {
                // 報告自体は送信済みなので、添付の紐付け失敗だけを記録する。
                console.error("Failed to link issue attachments:", attachmentError);
            }
        }

        return data as Issue;
    }

    async getIssues(): Promise<Issue[]> {
        const { data, error } = await supabase
            .from("issues")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return (data ?? []) as Issue[];
    }

    async getAttachments(issueId: string): Promise<IssueAttachmentWithUrl[]> {
        const { data, error } = await supabase
            .from("issue_attachments")
            .select("*")
            .eq("issue_id", issueId)
            .order("created_at", { ascending: true });

        if (error) throw error;

        return await Promise.all(
            ((data ?? []) as IssueAttachment[]).map(async (attachment) => {
                const { data: signed, error: signError } = await supabase.storage
                    .from(ATTACHMENT_BUCKET)
                    .createSignedUrl(attachment.storage_path, 60 * 60);
                if (signError) {
                    console.debug("Failed to sign an issue attachment:", signError);
                }
                return { ...attachment, url: signed?.signedUrl };
            }),
        );
    }
}

export default new IssueService();
