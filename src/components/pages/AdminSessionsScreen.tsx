//#region Import Modules
import { type FunctionComponent, useEffect, useState } from "react";
import { Message, MessageKeys } from "../../constants";
import { useAdmin } from "../../hooks/useAdmin";
import { type AdminColumn, AdminTable } from "../molecules/AdminTable";

//#endregion

//#region Types
type AdminSessionRow = {
    id?: string;
    user_id?: string;
    profile_id?: string | null;
    session_at?: string | null;
    asleep_at?: string | null;
    awake_at?: string | null;
    notes?: string | null;
    is_starred?: boolean | null;
    created_at?: string | null;
};

const columns: AdminColumn<AdminSessionRow>[] = [
    { title: "User", value: (session) => session.user_id ?? "", flex: 2 },
    { title: "Asleep", value: (session) => session.asleep_at ?? "", flex: 2 },
    { title: "Awake", value: (session) => session.awake_at ?? "", flex: 2 },
    { title: "Starred", value: (session) => (session.is_starred ? "Yes" : "No"), flex: 1 },
    {
        title: "Date",
        value: (session) => session.session_at ?? session.created_at ?? "",
        flex: 2,
    },
    { title: "ID", value: (session) => session.id ?? "", hidden: true },
    { title: "Profile ID", value: (session) => session.profile_id ?? "", hidden: true },
    { title: "Notes", value: (session) => session.notes ?? "", hidden: true },
    { title: "Uploaded", value: (session) => session.created_at ?? "", hidden: true },
];
//#endregion

//#region Component
export const AdminSessionsScreen: FunctionComponent = () => {
    const { fetchSessions, loading } = useAdmin();
    const [sessions, setSessions] = useState<AdminSessionRow[]>([]);

    useEffect(() => {
        fetchSessions().then(setSessions);
    }, [fetchSessions]);

    return (
        <AdminTable
            columns={columns}
            rows={sessions}
            loading={loading}
            emptyText={"No sessions found."}
            exportTitle={Message.get(MessageKeys.admin_sessions_title)}
            keyExtractor={(session, index) => session.id ?? String(index)}
            storageKey={"admin_sessions"}
            selectable
        />
    );
};
//#endregion
