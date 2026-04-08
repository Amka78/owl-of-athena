import { supabase } from "../clients/supabase";
import type { UserMessage } from "../types";

class MessageService {
    async getUserMessages(): Promise<UserMessage[]> {
        const { data, error } = await supabase
            .from("user_messages")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return (data ?? []) as UserMessage[];
    }

    async markMessageAsRead(messageId: string): Promise<UserMessage> {
        const now = new Date().toISOString();
        const { data, error } = await supabase
            .from("user_messages")
            .update({ read_at: now })
            .eq("id", messageId)
            .select()
            .single();

        if (error) throw error;
        return data as UserMessage;
    }

    async markAllMessagesAsRead(): Promise<void> {
        const now = new Date().toISOString();
        const { error } = await supabase
            .from("user_messages")
            .update({ read_at: now })
            .is("read_at", null);

        if (error) throw error;
    }

    async updateMessage(messageId: string, updates: Partial<UserMessage>): Promise<UserMessage> {
        const { data, error } = await supabase
            .from("user_messages")
            .update(updates)
            .eq("id", messageId)
            .select()
            .single();

        if (error) throw error;
        return data as UserMessage;
    }
}

export default new MessageService();
