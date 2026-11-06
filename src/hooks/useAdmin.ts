//#region Import Modules
import { useCallback, useState } from "react";
import { supabase } from "../clients/supabase";
import type { Issue } from "../types";
//#endregion

//#region Hooks
export const useAdmin = () => {
    const [loading, setLoading] = useState(false);

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
        fetchIssues,
        fetchMessages,
    };
};
//#endregion
