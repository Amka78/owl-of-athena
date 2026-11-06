//#region Import Modules
import { type FunctionComponent, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Message, MessageKeys } from "../../constants";
import { useAdmin } from "../../hooks/useAdmin";
import { IssueLogDialog } from "../molecules/IssueLogDialog";
//#endregion

//#region Component
export const AdminIssuesScreen: FunctionComponent = () => {
    const { fetchIssues, loading } = useAdmin();
    const [issues, setIssues] = useState<any[]>([]);

    useEffect(() => {
        fetchIssues().then(setIssues);
    }, [fetchIssues]);

    return (
        <View style={styles.container}>
            <IssueLogDialog />
            <View style={styles.header}>
                <Text style={[styles.headerCell, styles.flex3]}>Title</Text>
                <Text style={[styles.headerCell, styles.flex1]}>Platform</Text>
                <Text style={[styles.headerCell, styles.flex1]}>Version</Text>
                <Text style={[styles.headerCell, styles.flex1]}>Critical</Text>
                <Text style={[styles.headerCell, styles.flex1]}>Status</Text>
            </View>
            {loading && <Text style={styles.loading}>Loading...</Text>}
            <FlatList
                data={issues}
                keyExtractor={(item, index) => item.id ?? String(index)}
                renderItem={({ item }) => (
                    <View style={styles.rowContainer}>
                        <View style={styles.row}>
                            <Text style={[styles.cell, styles.flex3]}>{item.title ?? "—"}</Text>
                            <Text style={[styles.cell, styles.flex1]}>{item.platform ?? "—"}</Text>
                            <Text style={[styles.cell, styles.flex1]}>{item.version ?? "—"}</Text>
                            <Text style={[styles.cell, styles.flex1]}>
                                {item.critical ? "Yes" : "No"}
                            </Text>
                            <Text style={[styles.cell, styles.flex1]}>{item.status ?? "—"}</Text>
                        </View>
                        <TouchableOpacity
                            accessibilityRole="button"
                            onPress={() =>
                                IssueLogDialog.show({
                                    title: item.title,
                                    logs: item.logs ?? "",
                                    issueId: item.id,
                                })
                            }
                        >
                            {item.logs ? (
                                <Text style={styles.logs} numberOfLines={4}>
                                    {item.logs}
                                </Text>
                            ) : null}
                            <Text style={styles.logsHint}>
                                {Message.get(MessageKeys.admin_issue_logs_open_hint)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    !loading ? <Text style={styles.empty}>No issues found.</Text> : undefined
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
    row: { flexDirection: "row", padding: 8 },
    rowContainer: { borderBottomWidth: 1, borderBottomColor: Colors.blue },
    cell: { color: Colors.white, fontSize: 12 },
    logs: {
        color: Colors.white,
        opacity: 0.6,
        fontFamily: "monospace",
        fontSize: 10,
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
    logsHint: {
        color: Colors.cyan,
        fontSize: 10,
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
    flex1: { flex: 1 },
    flex3: { flex: 3 },
    loading: { color: Colors.cyan, textAlign: "center", padding: 16 },
    empty: { color: Colors.white, textAlign: "center", padding: 16 },
});
//#endregion
