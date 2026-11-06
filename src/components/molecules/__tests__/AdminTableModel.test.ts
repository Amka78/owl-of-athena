import type { AdminColumn } from "../AdminTableModel";
import {
    paginateAdminRows,
    queryAdminRows,
    toAdminCsvRows,
    toggleSelectedKey,
} from "../AdminTableModel";

type Row = {
    id: string;
    name: string;
    score: string;
};

const rows: Row[] = [
    { id: "1", name: "Jane", score: "9" },
    { id: "2", name: "John", score: "10" },
    { id: "3", name: "Alice", score: "2" },
];

const columns: AdminColumn<Row>[] = [
    { title: "Name", value: (row) => row.name },
    { title: "Score", value: (row) => row.score },
    { title: "ID", value: (row) => row.id, hidden: true },
];

const visibleColumns = columns.filter((column) => !column.hidden);

describe("AdminTableModel", () => {
    it("filters rows across columns, ignoring case", () => {
        expect(queryAdminRows(rows, visibleColumns, { search: "jAnE" })).toEqual([rows[0]]);
        expect(queryAdminRows(rows, visibleColumns, { search: "10" })).toEqual([rows[1]]);
    });

    it("returns every row when the search is empty or whitespace", () => {
        expect(queryAdminRows(rows, visibleColumns, { search: "  " })).toEqual(rows);
    });

    it("sorts numbers by their numeric value", () => {
        expect(
            queryAdminRows(rows, visibleColumns, {
                search: "",
                sort: { title: "Score", direction: "asc" },
            }).map((row) => row.score),
        ).toEqual(["2", "9", "10"]);

        expect(
            queryAdminRows(rows, visibleColumns, {
                search: "",
                sort: { title: "Score", direction: "desc" },
            }).map((row) => row.score),
        ).toEqual(["10", "9", "2"]);
    });

    it("keeps the filtered order when the sort column is unknown", () => {
        expect(
            queryAdminRows(rows, visibleColumns, {
                search: "o",
                sort: { title: "Missing", direction: "asc" },
            }),
        ).toEqual([rows[1]]);
    });

    it("paginates rows and clamps an out-of-range page", () => {
        const first = paginateAdminRows(rows, 0, 2);
        expect(first.pageRows).toEqual([rows[0], rows[1]]);
        expect(first).toMatchObject({ page: 0, totalPages: 2 });

        const last = paginateAdminRows(rows, 99, 2);
        expect(last.pageRows).toEqual([rows[2]]);
        expect(last).toMatchObject({ page: 1, totalPages: 2 });
    });

    it("treats an empty list as a single page", () => {
        expect(paginateAdminRows([], 0, 2)).toEqual({ pageRows: [], page: 0, totalPages: 1 });
    });

    it("includes hidden columns in the CSV rows", () => {
        expect(toAdminCsvRows([rows[0]], columns)).toEqual([["Jane", "9", "1"]]);
    });

    it("toggles a selected key", () => {
        expect(toggleSelectedKey([], "1")).toEqual(["1"]);
        expect(toggleSelectedKey(["1", "2"], "2")).toEqual(["1"]);
        expect(toggleSelectedKey(["1"], "1")).toEqual([]);
    });
});
