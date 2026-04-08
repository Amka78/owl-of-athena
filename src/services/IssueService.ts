import { supabase } from "../clients/supabase";
import type { Issue, CreateIssue } from "../types";
import Constants from "expo-constants";
import { Platform } from "react-native";

class IssueService {
    async createIssue(issueData: CreateIssue): Promise<Issue> {
        const version = Constants.expoConfig?.version ?? "unknown";
        const platform = Platform.OS;

        const { data, error } = await supabase
            .from("issues")
            .insert({
                ...issueData,
                platform,
                version,
                status: "open",
            })
            .select()
            .single();

        if (error) throw error;
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
}

export default new IssueService();
