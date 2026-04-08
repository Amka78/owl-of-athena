//#region Import Modules
import React, { type FunctionComponent, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants";
import { useAdmin } from "../../hooks/useAdmin";
//#endregion

//#region Component
export const AdminOrdersScreen: FunctionComponent = () => {
    const { fetchOrders, loading } = useAdmin();
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        fetchOrders().then(setOrders);
    }, [fetchOrders]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.headerCell, styles.flex2]}>Name</Text>
                <Text style={[styles.headerCell, styles.flex2]}>Email</Text>
                <Text style={[styles.headerCell, styles.flex1]}>Amount</Text>
                <Text style={[styles.headerCell, styles.flex1]}>Status</Text>
                <Text style={[styles.headerCell, styles.flex2]}>Date</Text>
            </View>
            {loading && <Text style={styles.loading}>Loading...</Text>}
            <FlatList
                data={orders}
                keyExtractor={(item, index) => item.id ?? String(index)}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={[styles.cell, styles.flex2]}>{item.billing_name ?? "—"}</Text>
                        <Text style={[styles.cell, styles.flex2]}>{item.billing_email ?? "—"}</Text>
                        <Text style={[styles.cell, styles.flex1]}>{item.amount_total ?? "—"}</Text>
                        <Text style={[styles.cell, styles.flex1]}>{item.status ?? "—"}</Text>
                        <Text style={[styles.cell, styles.flex2]}>{item.created_at ?? "—"}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    !loading ? <Text style={styles.empty}>No orders found.</Text> : null
                }
            />
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.navy },
    header: { flexDirection: "row", backgroundColor: Colors.navy_darker, padding: 8 },
    headerCell: { color: Colors.first_accent_color, fontWeight: "bold", fontSize: 12 },
    row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: Colors.blue, padding: 8 },
    cell: { color: Colors.white, fontSize: 12 },
    flex1: { flex: 1 },
    flex2: { flex: 2 },
    loading: { color: Colors.cyan, textAlign: "center", padding: 16 },
    empty: { color: Colors.white, textAlign: "center", padding: 16 },
});
//#endregion
