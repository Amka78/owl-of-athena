import { create } from "zustand";
import IssueService from "../services/IssueService";
import type { CreateIssue, IssueAttachmentInput } from "../types";

type IssueStore = {
    loading: boolean;
    error?: string;
    success: boolean;
    createIssue: (data: CreateIssue, attachments?: IssueAttachmentInput[]) => Promise<void>;
    reset: () => void;
};

export const useIssueStore = create<IssueStore>()((set) => ({
    loading: false,
    error: undefined,
    success: false,

    createIssue: async (data: CreateIssue, attachments: IssueAttachmentInput[] = []) => {
        set({ loading: true, error: undefined, success: false });
        try {
            await IssueService.createIssue(data, attachments);
            set({ loading: false, success: true });
        } catch (e: any) {
            set({ loading: false, error: e?.message ?? "Failed to send issue report" });
        }
    },

    reset: () => set({ loading: false, error: undefined, success: false }),
}));
