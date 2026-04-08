import { create } from "zustand";
import type { CreateIssue } from "../types";
import IssueService from "../services/IssueService";

type IssueStore = {
    loading: boolean;
    error?: string;
    success: boolean;
    createIssue: (data: CreateIssue) => Promise<void>;
    reset: () => void;
};

export const useIssueStore = create<IssueStore>()((set) => ({
    loading: false,
    error: undefined,
    success: false,

    createIssue: async (data: CreateIssue) => {
        set({ loading: true, error: undefined, success: false });
        try {
            await IssueService.createIssue(data);
            set({ loading: false, success: true });
        } catch (e: any) {
            set({ loading: false, error: e?.message ?? "Failed to send issue report" });
        }
    },

    reset: () => set({ loading: false, error: undefined, success: false }),
}));
