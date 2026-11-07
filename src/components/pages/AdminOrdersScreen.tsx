//#region Import Modules
import type { FunctionComponent } from "react";
import { Message, MessageKeys } from "../../constants";
import { createSupabaseAdminDataSource } from "../../services/AdminQueryService";
import type { Order } from "../../types";
import { type AdminColumn, AdminTable } from "../molecules/AdminTable";

//#endregion

//#region Types
type AdminOrderRow = Order & {
    user_id?: string;
    updated_at?: string;
};

const columns: AdminColumn<AdminOrderRow>[] = [
    {
        title: "Name",
        value: (order) => order.billing_name ?? "",
        flex: 2,
        field: "billing_name",
        searchFields: ["billing_name"],
    },
    {
        title: "Email",
        value: (order) => order.billing_email ?? "",
        flex: 2,
        field: "billing_email",
        searchFields: ["billing_email"],
    },
    {
        title: "Amount",
        value: (order) => (order.amount_total != null ? String(order.amount_total) : ""),
        flex: 1,
        field: "amount_total",
        searchFields: ["amount_total::text"],
    },
    {
        title: "Origin",
        value: (order) => order.transaction_origin ?? "",
        flex: 2,
        hidden: true,
        field: "transaction_origin",
        searchFields: ["transaction_origin"],
    },
    {
        title: "Status",
        value: (order) => order.status ?? "",
        flex: 1,
        field: "status",
        searchFields: ["status"],
    },
    {
        title: "Date",
        value: (order) => order.created_at ?? "",
        flex: 2,
        field: "created_at",
        searchFields: ["created_at::text"],
    },
    {
        title: "ID",
        value: (order) => order.id,
        hidden: true,
        field: "id",
        searchFields: ["id::text"],
    },
    {
        title: "User ID",
        value: (order) => order.user_id ?? "",
        hidden: true,
        field: "user_id",
        searchFields: ["user_id::text"],
    },
    {
        title: "Updated",
        value: (order) => order.updated_at ?? "",
        hidden: true,
        field: "updated_at",
        searchFields: ["updated_at::text"],
    },
];

const dataSource = createSupabaseAdminDataSource<AdminOrderRow>("orders", {
    defaultSort: { field: "created_at", ascending: false },
});
//#endregion

//#region Component
export const AdminOrdersScreen: FunctionComponent = () => {
    return (
        <AdminTable
            columns={columns}
            dataSource={dataSource}
            emptyText={"No orders found."}
            exportTitle={Message.get(MessageKeys.admin_orders_title)}
            keyExtractor={(order, index) => order.id ?? String(index)}
            storageKey={"admin_orders"}
            selectable
        />
    );
};
//#endregion
