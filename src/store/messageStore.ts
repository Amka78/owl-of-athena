import { create } from "zustand";
import type { UserMessage } from "../types";
import MessageService from "../services/MessageService";

type MessageStore = {
    messages: UserMessage[];
    loading: boolean;
    error?: string;
    loadMessages: () => Promise<void>;
    markAsRead: (messageId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    updateMessageRespondent: (messageId: string, respondentId: string) => Promise<void>;
};

export const useMessageStore = create<MessageStore>()((set, get) => ({
    messages: [],
    loading: false,
    error: undefined,

    loadMessages: async () => {
        set({ loading: true, error: undefined });
        try {
            const messages = await MessageService.getUserMessages();
            set({ messages, loading: false });
        } catch (e: any) {
            set({ loading: false, error: e?.message ?? "Failed to load messages" });
        }
    },

    markAsRead: async (messageId: string) => {
        try {
            const updated = await MessageService.markMessageAsRead(messageId);
            set((state) => ({
                messages: state.messages.map((m) => (m.id === messageId ? updated : m)),
            }));
        } catch {
            // ignore
        }
    },

    markAllAsRead: async () => {
        try {
            await MessageService.markAllMessagesAsRead();
            const now = new Date().toISOString();
            set((state) => ({
                messages: state.messages.map((m) => ({ ...m, read_at: m.read_at ?? now })),
            }));
        } catch {
            // ignore
        }
    },

    updateMessageRespondent: async (messageId: string, respondentId: string) => {
        try {
            const updated = await MessageService.updateMessage(messageId, {
                questionnaire_respondent_id: respondentId,
            });
            set((state) => ({
                messages: state.messages.map((m) => (m.id === messageId ? updated : m)),
            }));
        } catch {
            // ignore
        }
    },
}));
