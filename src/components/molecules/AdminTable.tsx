//#region Import Modules
import type React from "react";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Colors, Message, MessageKeys } from "../../constants";
import { buildTableCsv, shareText } from "../../services/ExportService";
import type { AdminColumn, AdminSort } from "./AdminTableModel";
import { paginateAdminRows, queryAdminRows, toAdminCsvRows } from "./AdminTableModel";

//#endregion

//#region Types
export type { AdminColumn } from "./AdminTableModel";

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
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<AdminSort>();
    const [pageIndex, setPageIndex] = useState(0);

    const visibleColumns = props.columns.filter((column) => !column.hidden);
    const matchedRows = queryAdminRows(props.rows, visibleColumns, { search, sort });
    const { pageRows, page, totalPages } = paginateAdminRows(matchedRows, pageIndex);

    const onSearchChange = (value: string): void => {
        setSearch(value);
        setPageIndex(0);
    };

    const onHeaderPress = (title: string): void => {
        setSort((current) =>
            current?.title === title
                ? { title, direction: current.direction === "asc" ? "desc" : "asc" }
                : { title, direction: "asc" },
        );
        setPageIndex(0);
    };

    const onExportPress = async () => {
        try {
            await shareText(
                props.exportTitle,
                buildTableCsv(
                    props.columns.map((column) => column.title),
                    toAdminCsvRows(matchedRows, props.columns),
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
                <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={onSearchChange}
                    placeholder={"Search"}
                    placeholderTextColor={Colors.white}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TouchableOpacity style={styles.exportButton} onPress={onExportPress}>
                    <Text style={styles.exportButtonText}>
                        {Message.get(MessageKeys.admin_export_csv_button)}
                    </Text>
                </TouchableOpacity>
            </View>
            {exportError ? <Text style={styles.error}>{exportError}</Text> : null}
            <View style={styles.header}>
                {visibleColumns.map((column) => (
                    <TouchableOpacity
                        key={column.title}
                        style={{ flex: column.flex ?? 1 }}
                        onPress={() => onHeaderPress(column.title)}
                    >
                        <Text style={styles.headerCell}>
                            {column.title}
                            {sort?.title === column.title
                                ? sort.direction === "asc"
                                    ? " ↑"
                                    : " ↓"
                                : ""}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            {props.loading && <Text style={styles.loading}>Loading...</Text>}
            <FlatList
                data={pageRows}
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
                    !props.loading ? (
                        <Text style={styles.empty}>
                            {search.trim() ? "No matching rows." : props.emptyText}
                        </Text>
                    ) : undefined
                }
            />
            {totalPages > 1 && (
                <View style={styles.pagination}>
                    <TouchableOpacity disabled={page === 0} onPress={() => setPageIndex(page - 1)}>
                        <Text style={[styles.pageButton, page === 0 && styles.pageButtonDisabled]}>
                            ‹ Prev
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.pageLabel}>
                        {page + 1} / {totalPages}
                    </Text>
                    <TouchableOpacity
                        disabled={page >= totalPages - 1}
                        onPress={() => setPageIndex(page + 1)}
                    >
                        <Text
                            style={[
                                styles.pageButton,
                                page >= totalPages - 1 && styles.pageButtonDisabled,
                            ]}
                        >
                            Next ›
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.navy },
    toolbar: {
        flexDirection: "row",
        alignItems: "center",
        padding: 4,
        backgroundColor: Colors.navy_darker,
    },
    searchInput: {
        flex: 1,
        color: Colors.white,
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
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
    pagination: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: Colors.navy_darker,
    },
    pageButton: { color: Colors.first_accent_color, fontSize: 12 },
    pageButtonDisabled: { opacity: 0.4 },
    pageLabel: { color: Colors.white, fontSize: 12 },
});
//#endregion
