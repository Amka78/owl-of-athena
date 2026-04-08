//#region Import Modules
import React, { type FunctionComponent, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants";
import { useAdmin } from "../../hooks/useAdmin";
//#endregion

//#region Component
export const AdminMessagesScreen: FunctionComponent = () => {
    const { fetchMessages, loading } = useAdmin();
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        fetchMessages().then(setMessages);
    }, [fetchMessages]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.headerCell, styles.flex3]}>Title</Text>
                <Text style={[styles.headerCell, styles.flex1]}>Type</Text>
                <Text style={[styles.headerCell, styles.flex1]}>Platform</Text>
                <Text style={[styles.headerCell, styles.flex1]}>Reads</Text>
                <Text style={[styles.headerCell, styles.flex2]}>Date</Text>
            </View>
            {loading && <Text style={styles.loading}>Loading...</Text>}
            <FlatList
                data={messages}
                keyExtractor={(item, index) => item.id ?? String(index)}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={[styles.cell, styles.flex3]}>{item.title ?? "—"}</Text>
                        <Text style={[styles.cell, styles.flex1]}>{item.type ?? "—"}</Text>
                        <Text style={[styles.cell, styles.flex1]}>{item.platform ?? "—"}</Text>
                        <Text style={[styles.cell, styles.flex1]}>{item.read_count ?? "0"}</Text>
                        <Text style={[styles.cell, styles.flex2]}>{item.created_at ?? "—"}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    !loading ? <Text style={styles.empty}>No messages found.</Text> : null
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
    flex3: { flex: 3 },
    loading: { color: Colors.cyan, textAlign: "center", padding: 16 },
    empty: { color: Colors.white, textAlign: "center", padding: 16 },
});
//#endregion
