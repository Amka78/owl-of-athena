//#region Import Modules
import type React from "react";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Message, MessageKeys } from "../../constants";
import type { CsvValue } from "../../services/ExportService";
import { buildTableCsv, shareText } from "../../services/ExportService";
//#endregion

//#region Types
export type AdminColumn<T> = {
    title: string;
    value: (row: T) => string;
    csv?: (row: T) => CsvValue;
    hidden?: boolean;
    flex?: number;
};

export type AdminTableProps<T> = {
    columns: AdminColumn<T>[];
    rows: T[];
    loading: boolean;
    emptyText: string;
    exportTitle: string;
    keyExtractor: (row: T, index: number) => string;
};
//#endregion

//#region Component
export const AdminTable = <T,>(props: AdminTableProps<T>): React.ReactElement => {
    const [exportError, setExportError] = useState<string>();
    const visibleColumns = props.columns.filter((column) => !column.hidden);

    const onExportPress = async () => {
        const rows = props.rows.map((row) =>
            props.columns.map((column) => (column.csv ?? column.value)(row)),
        );
        try {
            await shareText(
                props.exportTitle,
                buildTableCsv(
                    props.columns.map((column) => column.title),
                    rows,
                ),
            );
            setExportError(undefined);
        } catch (e: any) {
            setExportError(e?.message ?? Message.get(MessageKeys.export_failed));
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.toolbar}>
                <TouchableOpacity style={styles.exportButton} onPress={onExportPress}>
                    <Text style={styles.exportButtonText}>
                        {Message.get(MessageKeys.admin_export_csv_button)}
                    </Text>
                </TouchableOpacity>
            </View>
            {exportError ? <Text style={styles.error}>{exportError}</Text> : null}
            <View style={styles.header}>
                {visibleColumns.map((column) => (
                    <Text
                        key={column.title}
                        style={[styles.headerCell, { flex: column.flex ?? 1 }]}
                    >
                        {column.title}
                    </Text>
                ))}
            </View>
            {props.loading && <Text style={styles.loading}>Loading...</Text>}
            <FlatList
                data={props.rows}
                keyExtractor={props.keyExtractor}
                renderItem={({ item }) => (
                    <View style={styles.rowContainer}>
                        <View style={styles.row}>
                            {visibleColumns.map((column) => (
                                <Text
                                    key={column.title}
                                    style={[styles.cell, { flex: column.flex ?? 1 }]}
                                    numberOfLines={1}
                                >
                                    {column.value(item) || "—"}
                                </Text>
                            ))}
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    !props.loading ? <Text style={styles.empty}>{props.emptyText}</Text> : undefined
                }
            />
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.navy },
    toolbar: {
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 4,
        backgroundColor: Colors.navy_darker,
    },
    exportButton: { paddingHorizontal: 10, paddingVertical: 4 },
    exportButtonText: { color: Colors.first_accent_color, fontSize: 12 },
    header: { flexDirection: "row", backgroundColor: Colors.navy_darker, padding: 8 },
    headerCell: { color: Colors.first_accent_color, fontWeight: "bold", fontSize: 12 },
    row: { flexDirection: "row", padding: 8 },
    rowContainer: { borderBottomWidth: 1, borderBottomColor: Colors.blue },
    cell: { color: Colors.white, fontSize: 12 },
    loading: { color: Colors.cyan, textAlign: "center", padding: 16 },
    empty: { color: Colors.white, textAlign: "center", padding: 16 },
    error: { color: "#ff4310", fontSize: 12, paddingHorizontal: 8, paddingVertical: 4 },
});
//#endregion
