//#region Import Modules
import type { FunctionComponent } from "react";
import { Message, MessageKeys } from "../../constants";
import { createSupabaseAdminDataSource } from "../../services/AdminQueryService";
import { type AdminColumn, AdminTable } from "../molecules/AdminTable";

//#endregion

//#region Types
type AdminUserRow = {
    id?: string;
    first_name?: string | null;
    last_name?: string | null;
    birthday?: string | null;
    gender?: string | null;
    roles?: { slug?: string; title?: string }[] | null;
    created_at?: string | null;
    updated_at?: string | null;
};

const formatRoles = (roles: AdminUserRow["roles"]): string => {
    return (roles ?? [])
        .map((role) => role.slug ?? role.title ?? "")
        .filter(Boolean)
        .join(", ");
};

const columns: AdminColumn<AdminUserRow>[] = [
    {
        title: "Name",
        value: (user) => [user.first_name, user.last_name].filter(Boolean).join(" "),
        flex: 2,
        field: "last_name",
        searchFields: ["first_name", "last_name"],
    },
    {
        title: "Birthday",
        value: (user) => user.birthday ?? "",
        flex: 2,
        field: "birthday",
        searchFields: ["birthday::text"],
    },
    {
        title: "Gender",
        value: (user) => user.gender ?? "",
        flex: 1,
        field: "gender",
        searchFields: ["gender"],
    },
    {
        title: "Roles",
        value: (user) => formatRoles(user.roles),
        flex: 2,
        field: "roles",
        searchFields: ["roles::text"],
    },
    {
        title: "Signup Date",
        value: (user) => user.created_at ?? "",
        flex: 2,
        field: "created_at",
        searchFields: ["created_at::text"],
    },
    {
        title: "ID",
        value: (user) => user.id ?? "",
        hidden: true,
        field: "id",
        searchFields: ["id::text"],
    },
    {
        title: "Updated",
        value: (user) => user.updated_at ?? "",
        hidden: true,
        field: "updated_at",
        searchFields: ["updated_at::text"],
    },
];

const dataSource = createSupabaseAdminDataSource<AdminUserRow>("users", {
    defaultSort: { field: "created_at", ascending: false },
});
//#endregion

//#region Component
export const AdminUsersScreen: FunctionComponent = () => {
    return (
        <AdminTable
            columns={columns}
            dataSource={dataSource}
            emptyText={"No users found."}
            exportTitle={Message.get(MessageKeys.admin_users_title)}
            keyExtractor={(user, index) => user.id ?? String(index)}
            storageKey={"admin_users"}
            selectable
        />
    );
};
//#endregion
