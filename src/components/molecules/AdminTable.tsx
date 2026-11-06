//#region Import Modules
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Colors, Message, MessageKeys } from "../../constants";
import { ADMIN_PAGE_SIZE, type AdminDataSource } from "../../services/AdminQueryModel";
import { buildTableCsv, shareText } from "../../services/ExportService";
import { loadHiddenColumns, saveHiddenColumns } from "./AdminTableColumnPrefs";
import type { AdminColumn, AdminSort } from "./AdminTableModel";
import {
    collectAdminSearchFields,
    paginateAdminRows,
    queryAdminRows,
    resolveAdminSortField,
    toAdminCsvRows,
} from "./AdminTableModel";

//#endregion

//#region Constants
const SEARCH_DEBOUNCE_MS = 250;

//#endregion

//#region Types
export type { AdminColumn } from "./AdminTableModel";

export type AdminTableProps<T> = {
    columns: AdminColumn<T>[];
    /** dataSource を渡さない場合に使う全件データ。 */
    rows?: T[];
    loading?: boolean;
    emptyText: string;
    exportTitle: string;
    keyExtractor: (row: T, index: number) => string;
    /** 指定すると列の表示／非表示を端末に保存し、次回も復元する。 */
    storageKey?: string;
    /** 行頭にチェックボックスを表示し、選択行だけの CSV 共有を可能にする。 */
    selectable?: boolean;
    /** 指定すると検索・ソート・ページングをサーバ側で行う。 */
    dataSource?: AdminDataSource<T>;
    /** 選択行を ZIP などでまとめてダウンロードする処理。 */
    onDownloadSelected?: (rows: T[]) => Promise<void>;
};

type SelectedRow<T> = {
    key: string;
    row: T;
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
    const [selectedRows, setSelectedRows] = useState<SelectedRow<T>[]>([]);
    const [serverRows, setServerRows] = useState<T[]>([]);
    const [serverTotal, setServerTotal] = useState(0);
    const [serverLoading, setServerLoading] = useState(props.dataSource !== undefined);
    const [serverError, setServerError] = useState<string>();
    const [selectionActionPending, setSelectionActionPending] = useState(false);

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

    const visibleColumns = useMemo(
        () =>
            props.columns.filter((column) =>
                hiddenTitles === undefined
                    ? column.hidden !== true
                    : !hiddenTitles.includes(column.title),
            ),
        [props.columns, hiddenTitles],
    );
    const searchFields = useMemo(() => collectAdminSearchFields(visibleColumns), [visibleColumns]);
    const sortField = resolveAdminSortField(visibleColumns, sort);
    const isServerSide = props.dataSource !== undefined;
    const sourceRows = isServerSide ? serverRows : (props.rows ?? []);
    const matchedRows = isServerSide
        ? sourceRows
        : queryAdminRows(sourceRows, visibleColumns, { search, sort });
    const totalCount = isServerSide ? serverTotal : matchedRows.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / ADMIN_PAGE_SIZE));
    const clientPage = paginateAdminRows(matchedRows, pageIndex);
    const page = isServerSide ? Math.min(pageIndex, totalPages - 1) : clientPage.page;
    const pageRows = isServerSide ? matchedRows : clientPage.pageRows;

    useEffect(() => {
        if (pageIndex > totalPages - 1) {
            setPageIndex(totalPages - 1);
        }
    }, [pageIndex, totalPages]);

    useEffect(() => {
        const dataSource = props.dataSource;
        if (dataSource === undefined) {
            return;
        }
        let active = true;
        const timer = setTimeout(() => {
            setServerLoading(true);
            dataSource
                .fetchPage({
                    search,
                    searchFields,
                    sort:
                        sortField === undefined
                            ? undefined
                            : { field: sortField, ascending: sort?.direction === "asc" },
                    pageIndex,
                    pageSize: ADMIN_PAGE_SIZE,
                })
                .then((result) => {
                    if (!active) {
                        return;
                    }
                    setServerRows(result.rows);
                    setServerTotal(result.total);
                    setServerError(undefined);
                })
                .catch((e: any) => {
                    if (!active) {
                        return;
                    }
                    setServerRows([]);
                    setServerTotal(0);
                    setServerError(e?.message ?? "Failed to load rows.");
                })
                .finally(() => {
                    if (active) {
                        setServerLoading(false);
                    }
                });
        }, SEARCH_DEBOUNCE_MS);
        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [props.dataSource, search, searchFields, sortField, sort?.direction, pageIndex]);

    const rowKeys = new Map<T, string>();
    pageRows.forEach((row, index) => {
        rowKeys.set(row, props.keyExtractor(row, page * ADMIN_PAGE_SIZE + index));
    });
    const keyOf = (row: T): string => rowKeys.get(row) ?? "";

    const selectedKeySet = new Set(selectedRows.map((selected) => selected.key));
    const allSelected =
        props.selectable === true &&
        pageRows.length > 0 &&
        pageRows.every((row) => selectedKeySet.has(keyOf(row)));

    const onRowSelectPress = (key: string, row: T): void => {
        setSelectedRows((current) =>
            current.some((selected) => selected.key === key)
                ? current.filter((selected) => selected.key !== key)
                : [...current, { key, row }],
        );
    };

    const onSelectAllPress = (): void => {
        const pageKeys = pageRows.map((row) => keyOf(row));
        const allPageSelected =
            pageKeys.length > 0 && pageKeys.every((key) => selectedKeySet.has(key));
        if (allPageSelected) {
            setSelectedRows((current) =>
                current.filter((selected) => !pageKeys.includes(selected.key)),
            );
            return;
        }
        setSelectedRows((current) => {
            const existing = new Set(current.map((selected) => selected.key));
            const additions = pageRows
                .filter((row) => !existing.has(keyOf(row)))
                .map((row) => ({ key: keyOf(row), row }));
            return [...current, ...additions];
        });
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
        if (
            props.dataSource !== undefined &&
            props.columns.find((column) => column.title === title)?.field === undefined
        ) {
            return;
        }
        setSort((current) =>
            current?.title === title
                ? { title, direction: current.direction === "asc" ? "desc" : "asc" }
                : { title, direction: "asc" },
        );
        setPageIndex(0);
    };

    const onDownloadSelectedPress = async (): Promise<void> => {
        if (props.onDownloadSelected === undefined || selectionActionPending) {
            return;
        }
        setSelectionActionPending(true);
        try {
            await props.onDownloadSelected(selectedRows.map((selected) => selected.row));
            setExportError(undefined);
        } catch (e: any) {
            setExportError(e?.message ?? Message.get(MessageKeys.export_failed));
        } finally {
            setSelectionActionPending(false);
        }
    };

    const shareRows = async (rows: T[]): Promise<void> => {
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

    const onExportAllPress = async (): Promise<void> => {
        if (props.dataSource === undefined) {
            await shareRows(matchedRows);
            return;
        }
        try {
            const rows = await props.dataSource.fetchAll({
                search,
                searchFields,
                sort:
                    sortField === undefined
                        ? undefined
                        : { field: sortField, ascending: sort?.direction === "asc" },
            });
            await shareRows(rows);
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
                    onPress={() => void onExportAllPress()}
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
                        onPress={() => void shareRows(selectedRows.map((selected) => selected.row))}
                        testID="admin-share-selected-button"
                    >
                        <Text style={styles.exportButtonText}>
                            {Message.get(MessageKeys.admin_export_csv_button)}
                        </Text>
                    </TouchableOpacity>
                    {props.onDownloadSelected !== undefined && (
                        <TouchableOpacity
                            style={styles.selectionAction}
                            disabled={selectionActionPending}
                            onPress={() => void onDownloadSelectedPress()}
                            testID="admin-download-selected-button"
                        >
                            <Text
                                style={[
                                    styles.exportButtonText,
                                    selectionActionPending && styles.pageButtonDisabled,
                                ]}
                            >
                                {Message.get(MessageKeys.download_zip)}
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.selectionAction}
                        onPress={() => setSelectedRows([])}
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
            {(serverError ?? exportError) ? (
                <Text style={styles.error}>{serverError ?? exportError}</Text>
            ) : null}
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
            {(props.loading === true || serverLoading) && (
                <Text style={styles.loading}>Loading...</Text>
            )}
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
                                        onPress={() => onRowSelectPress(rowKey, item)}
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
                    !(props.loading === true || serverLoading) ? (
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
