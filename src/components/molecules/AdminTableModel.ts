//#region Import Modules
import type { CsvValue } from "../../services/ExportService";
//#endregion

//#region Types
export type AdminColumn<T> = {
    title: string;
    value: (row: T) => string;
    csv?: (row: T) => CsvValue;
    hidden?: boolean;
    flex?: number;
};

export type AdminSort = {
    title: string;
    direction: "asc" | "desc";
};

export type AdminQuery = {
    search: string;
    sort?: AdminSort;
};
//#endregion

//#region Constants
export const ADMIN_TABLE_PAGE_SIZE = 20;
//#endregion

//#region Functions
/** 表示中の列を対象に、部分一致の絞り込みと並べ替えを行う。 */
export const queryAdminRows = <T>(rows: T[], columns: AdminColumn<T>[], query: AdminQuery): T[] => {
    const needle = query.search.trim().toLowerCase();
    const filtered = needle
        ? rows.filter((row) =>
              columns.some((column) => column.value(row).toLowerCase().includes(needle)),
          )
        : rows;

    if (query.sort === undefined) {
        return filtered;
    }

    const column = columns.find((value) => value.title === query.sort!.title);
    if (column === undefined) {
        return filtered;
    }

    const direction = query.sort.direction === "asc" ? 1 : -1;
    return [...filtered].sort(
        (a, b) =>
            column.value(a).localeCompare(column.value(b), undefined, {
                numeric: true,
                sensitivity: "base",
            }) * direction,
    );
};

/** ページ番号を範囲内に丸め、そのページの行を返す。 */
export const paginateAdminRows = <T>(
    rows: T[],
    pageIndex: number,
    pageSize: number = ADMIN_TABLE_PAGE_SIZE,
): { pageRows: T[]; page: number; totalPages: number } => {
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    const page = Math.min(Math.max(0, Math.trunc(pageIndex)), totalPages - 1);
    const start = page * pageSize;

    return { pageRows: rows.slice(start, start + pageSize), page, totalPages };
};

/** 選択キーの追加と解除を切り替える。 */
export const toggleSelectedKey = (selected: string[], key: string): string[] => {
    return selected.includes(key) ? selected.filter((value) => value !== key) : [...selected, key];
};

/** 列の定義に従って CSV 用の行を作る。hidden 列も含める。 */
export const toAdminCsvRows = <T>(rows: T[], columns: AdminColumn<T>[]): CsvValue[][] => {
    return rows.map((row) => columns.map((column) => (column.csv ?? column.value)(row)));
};
//#endregion
