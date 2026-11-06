//#region Import Modules
import { type FunctionComponent, useEffect, useState } from "react";
import { Message, MessageKeys } from "../../constants";
import { useAdmin } from "../../hooks/useAdmin";
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
    },
    { title: "Birthday", value: (user) => user.birthday ?? "", flex: 2 },
    { title: "Gender", value: (user) => user.gender ?? "", flex: 1 },
    { title: "Roles", value: (user) => formatRoles(user.roles), flex: 2 },
    { title: "Signup Date", value: (user) => user.created_at ?? "", flex: 2 },
    { title: "ID", value: (user) => user.id ?? "", hidden: true },
    { title: "Updated", value: (user) => user.updated_at ?? "", hidden: true },
];
//#endregion

//#region Component
export const AdminUsersScreen: FunctionComponent = () => {
    const { fetchUsers, loading } = useAdmin();
    const [users, setUsers] = useState<AdminUserRow[]>([]);

    useEffect(() => {
        fetchUsers().then(setUsers);
    }, [fetchUsers]);

    return (
        <AdminTable
            columns={columns}
            rows={users}
            loading={loading}
            emptyText={"No users found."}
            exportTitle={Message.get(MessageKeys.admin_users_title)}
            keyExtractor={(user, index) => user.id ?? String(index)}
            storageKey={"admin_users"}
        />
    );
};
//#endregion
