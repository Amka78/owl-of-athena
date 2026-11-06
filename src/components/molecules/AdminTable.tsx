//#region Import Modules
import type React from "react";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Colors, Message, MessageKeys } from "../../constants";
import { buildTableCsv, shareText } from "../../services/ExportService";
import { loadHiddenColumns, saveHiddenColumns } from "./AdminTableColumnPrefs";
import type { AdminColumn, AdminSort } from "./AdminTableModel";
import {
    paginateAdminRows,
    queryAdminRows,
    toAdminCsvRows,
    toggleSelectedKey,
} from "./AdminTableModel";

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
    /** 指定すると列の表示／非表示を端末に保存し、次回も復元する。 */
    storageKey?: string;
    /** 行頭にチェックボックスを表示し、選択行だけの CSV 共有を可能にする。 */
    selectable?: boolean;
};
//#endregion

//#region Component
const CheckBoxMark = ({ checked }: { checked: boolean }): React.ReactElement => (
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Text style={styles.checkboxMark}>✓</Text> : null}
    </View>
);

export const AdminTable = <T,>(props: AdminTableProps<T>): React.ReactElement => {
    const [exportError, setExportError] = useState<string>();
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<AdminSort>();
    const [pageIndex, setPageIndex] = useState(0);
    const [hiddenTitles, setHiddenTitles] = useState<string[]>();
    const [showColumnMenu, setShowColumnMenu] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    useEffect(() => {
        if (props.storageKey === undefined) {
            return;
        }
        let active = true;
        loadHiddenColumns(props.storageKey).then((stored) => {
            if (active && stored !== undefined) {
                setHiddenTitles(stored);
            }
        });
        return () => {
            active = false;
        };
    }, [props.storageKey]);

    const isHidden = (column: AdminColumn<T>): boolean =>
        hiddenTitles === undefined ? column.hidden === true : hiddenTitles.includes(column.title);

    const visibleColumns = props.columns.filter((column) => !isHidden(column));
    const matchedRows = queryAdminRows(props.rows, visibleColumns, { search, sort });
    const { pageRows, page, totalPages } = paginateAdminRows(matchedRows, pageIndex);

    const rowKeys = new Map<T, string>();
    matchedRows.forEach((row, index) => {
        rowKeys.set(row, props.keyExtractor(row, index));
    });
    const keyOf = (row: T): string => rowKeys.get(row) ?? "";

    const selectedKeySet = new Set(selectedKeys);
    const selectedRows = props.selectable
        ? matchedRows.filter((row) => selectedKeySet.has(keyOf(row)))
        : [];
    const allSelected =
        props.selectable === true &&
        matchedRows.length > 0 &&
        matchedRows.every((row) => selectedKeySet.has(keyOf(row)));

    const onRowSelectPress = (key: string): void => {
        setSelectedKeys((current) => toggleSelectedKey(current, key));
    };

    const onSelectAllPress = (): void => {
        setSelectedKeys(allSelected ? [] : matchedRows.map((row) => keyOf(row)));
    };

    const onColumnToggle = (title: string): void => {
        const current =
            hiddenTitles ??
            props.columns.filter((column) => column.hidden).map((column) => column.title);
        const next = current.includes(title)
            ? current.filter((value) => value !== title)
            : [...current, title];
        if (props.columns.every((column) => next.includes(column.title))) {
            return;
        }
        setHiddenTitles(next);
        setPageIndex(0);
        if (props.storageKey !== undefined) {
            void saveHiddenColumns(props.storageKey, next);
        }
    };

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

    const onExportPress = async (rows: T[]): Promise<void> => {
        try {
            await shareText(
                props.exportTitle,
                buildTableCsv(
                    props.columns.map((column) => column.title),
                    toAdminCsvRows(rows, props.columns),
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
                <TouchableOpacity
                    style={styles.exportButton}
                    onPress={() => void onExportPress(matchedRows)}
                >
                    <Text style={styles.exportButtonText}>
                        {Message.get(MessageKeys.admin_export_csv_button)}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.exportButton}
                    onPress={() => setShowColumnMenu((current) => !current)}
                    testID="admin-columns-button"
                >
                    <Text style={styles.exportButtonText}>
                        {Message.get(MessageKeys.admin_columns_button)}
                    </Text>
                </TouchableOpacity>
            </View>
            {props.selectable && selectedRows.length > 0 && (
                <View style={styles.selectionBar}>
                    <Text style={styles.selectionCount}>
                        {Message.get(MessageKeys.admin_selected_count, [
                            String(selectedRows.length),
                        ])}
                    </Text>
                    <TouchableOpacity
                        style={styles.selectionAction}
                        onPress={() => void onExportPress(selectedRows)}
                        testID="admin-share-selected-button"
                    >
                        <Text style={styles.exportButtonText}>
                            {Message.get(MessageKeys.admin_export_csv_button)}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.selectionAction}
                        onPress={() => setSelectedKeys([])}
                        testID="admin-clear-selection-button"
                    >
                        <Text style={styles.exportButtonText}>
                            {Message.get(MessageKeys.admin_selection_clear)}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            {showColumnMenu && (
                <View style={styles.columnMenu}>
                    {props.columns.map((column) => {
                        const visible = !isHidden(column);
                        return (
                            <TouchableOpacity
                                key={column.title}
                                style={styles.columnMenuItem}
                                onPress={() => onColumnToggle(column.title)}
                                testID={`admin-column-${column.title}`}
                                accessibilityRole="checkbox"
                                accessibilityState={{ checked: visible }}
                            >
                                <CheckBoxMark checked={visible} />
                                <Text style={styles.columnMenuLabel}>{column.title}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
            {exportError ? <Text style={styles.error}>{exportError}</Text> : null}
            <View style={styles.header}>
                {props.selectable && (
                    <TouchableOpacity
                        style={styles.selectCell}
                        onPress={onSelectAllPress}
                        testID="admin-select-all"
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: allSelected }}
                    >
                        <CheckBoxMark checked={allSelected} />
                    </TouchableOpacity>
                )}
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
                keyExtractor={(item, index) => keyOf(item) || props.keyExtractor(item, index)}
                renderItem={({ item, index }) => {
                    const rowKey = keyOf(item) || props.keyExtractor(item, index);
                    const selected = selectedKeySet.has(rowKey);
                    return (
                        <View style={styles.rowContainer}>
                            <View style={styles.row}>
                                {props.selectable && (
                                    <TouchableOpacity
                                        style={styles.selectCell}
                                        onPress={() => onRowSelectPress(rowKey)}
                                        testID={`admin-row-select-${rowKey}`}
                                        accessibilityRole="checkbox"
                                        accessibilityState={{ checked: selected }}
                                    >
                                        <CheckBoxMark checked={selected} />
                                    </TouchableOpacity>
                                )}
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
                    );
                }}
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
    columnMenu: { backgroundColor: Colors.navy_darker, paddingVertical: 4 },
    columnMenuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    checkbox: {
        width: 14,
        height: 14,
        borderWidth: 1,
        borderColor: Colors.white,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    checkboxChecked: {
        backgroundColor: Colors.first_accent_color,
        borderColor: Colors.first_accent_color,
    },
    checkboxMark: { color: Colors.navy, fontSize: 10, lineHeight: 12 },
    columnMenuLabel: { color: Colors.white, fontSize: 12 },
    selectionBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: Colors.third_accent_color,
    },
    selectionCount: { flex: 1, color: Colors.white, fontSize: 12 },
    selectionAction: { paddingHorizontal: 8, paddingVertical: 2 },
    selectCell: { width: 26, alignItems: "center", justifyContent: "center" },
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
