//#region Import Modules
import type { FunctionComponent } from "react";
import SessionRestClient from "../../clients/SessionRestClient";
import { Message, MessageKeys } from "../../constants";
import { createSupabaseAdminDataSource } from "../../services/AdminQueryService";
import type { SessionZipItem } from "../../services/SessionZipService";
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
    {
        title: "User",
        value: (session) => session.user_id ?? "",
        flex: 2,
        field: "user_id",
        searchFields: ["user_id::text"],
    },
    {
        title: "Asleep",
        value: (session) => session.asleep_at ?? "",
        flex: 2,
        field: "asleep_at",
        searchFields: ["asleep_at::text"],
    },
    {
        title: "Awake",
        value: (session) => session.awake_at ?? "",
        flex: 2,
        field: "awake_at",
        searchFields: ["awake_at::text"],
    },
    {
        title: "Starred",
        value: (session) => (session.is_starred ? "Yes" : "No"),
        flex: 1,
        field: "is_starred",
        searchFields: ["is_starred::text"],
    },
    {
        title: "Date",
        value: (session) => session.session_at ?? session.created_at ?? "",
        flex: 2,
        field: "session_at",
        searchFields: ["session_at::text", "created_at::text"],
    },
    {
        title: "ID",
        value: (session) => session.id ?? "",
        hidden: true,
        field: "id",
        searchFields: ["id::text"],
    },
    {
        title: "Profile ID",
        value: (session) => session.profile_id ?? "",
        hidden: true,
        field: "profile_id",
        searchFields: ["profile_id::text"],
    },
    {
        title: "Notes",
        value: (session) => session.notes ?? "",
        hidden: true,
        field: "notes",
        searchFields: ["notes"],
    },
    {
        title: "Uploaded",
        value: (session) => session.created_at ?? "",
        hidden: true,
        field: "created_at",
        searchFields: ["created_at::text"],
    },
];

const dataSource = createSupabaseAdminDataSource<AdminSessionRow>("aurora_sessions", {
    defaultSort: { field: "session_at", ascending: false },
});
//#endregion

//#region Functions
const onDownloadSelected = async (rows: AdminSessionRow[]): Promise<void> => {
    const items = await Promise.all(
        rows.map(async (row): Promise<SessionZipItem | undefined> => {
            if (row.id === undefined) {
                return undefined;
            }
            const session = await SessionRestClient.getById(row.id);
            const detail = await SessionRestClient.getDetailsById(row.id);
            return { session, detail };
        }),
    );

    const validItems = items.filter((item): item is SessionZipItem => item !== undefined);
    if (validItems.length === 0) {
        return;
    }
    const { downloadSessionCollectionZip } = await import(
        "../../services/SessionZipDownloadService"
    );
    await downloadSessionCollectionZip(validItems);
};
//#endregion

//#region Component
export const AdminSessionsScreen: FunctionComponent = () => {
    return (
        <AdminTable
            columns={columns}
            dataSource={dataSource}
            emptyText={"No sessions found."}
            exportTitle={Message.get(MessageKeys.admin_sessions_title)}
            keyExtractor={(session, index) => session.id ?? String(index)}
            storageKey={"admin_sessions"}
            selectable
            onDownloadSelected={onDownloadSelected}
        />
    );
};
//#endregion
