//#region Import Modules
import { type FunctionComponent, useEffect, useState } from "react";
import { Message, MessageKeys } from "../../constants";
import { useAdmin } from "../../hooks/useAdmin";
import type { Order } from "../../types";
import { type AdminColumn, AdminTable } from "../molecules/AdminTable";

//#endregion

//#region Types
type AdminOrderRow = Order & {
    user_id?: string;
    updated_at?: string;
};

const columns: AdminColumn<AdminOrderRow>[] = [
    { title: "Name", value: (order) => order.billing_name ?? "", flex: 2 },
    { title: "Email", value: (order) => order.billing_email ?? "", flex: 2 },
    {
        title: "Amount",
        value: (order) => (order.amount_total != null ? String(order.amount_total) : ""),
        flex: 1,
    },
    { title: "Status", value: (order) => order.status ?? "", flex: 1 },
    { title: "Date", value: (order) => order.created_at ?? "", flex: 2 },
    { title: "ID", value: (order) => order.id, hidden: true },
    { title: "User ID", value: (order) => order.user_id ?? "", hidden: true },
    { title: "Updated", value: (order) => order.updated_at ?? "", hidden: true },
];
//#endregion

//#region Component
export const AdminOrdersScreen: FunctionComponent = () => {
    const { fetchOrders, loading } = useAdmin();
    const [orders, setOrders] = useState<AdminOrderRow[]>([]);

    useEffect(() => {
        fetchOrders().then(setOrders);
    }, [fetchOrders]);

    return (
        <AdminTable
            columns={columns}
            rows={orders}
            loading={loading}
            emptyText={"No orders found."}
            exportTitle={Message.get(MessageKeys.admin_orders_title)}
            keyExtractor={(order, index) => order.id ?? String(index)}
            storageKey={"admin_orders"}
        />
    );
};
//#endregion
