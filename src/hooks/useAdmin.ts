//#region Import Modules
import { useCallback, useState } from "react";
import { supabase } from "../clients/supabase";
import type { Issue, Order, UserMessage } from "../types";
//#endregion

//#region Hooks
export const useAdmin = () => {
    const [loading, setLoading] = useState(false);

    const fetchUsers = useCallback(async (): Promise<any[]> => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data ?? [];
        } catch {
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOrders = useCallback(async (): Promise<Order[]> => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return (data ?? []) as Order[];
        } catch {
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSessions = useCallback(async (): Promise<any[]> => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("aurora_sessions")
                .select("*")
                .order("session_at", { ascending: false });
            if (error) throw error;
            return data ?? [];
        } catch {
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchIssues = useCallback(async (): Promise<Issue[]> => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("issues")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return (data ?? []) as Issue[];
        } catch {
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMessages = useCallback(async (): Promise<any[]> => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data ?? [];
        } catch {
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        fetchUsers,
        fetchOrders,
        fetchSessions,
        fetchIssues,
        fetchMessages,
    };
};
//#endregion
