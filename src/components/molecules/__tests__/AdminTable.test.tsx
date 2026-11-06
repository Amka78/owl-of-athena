import { fireEvent, render, waitFor } from "@testing-library/react-native";

import type { AdminDataSource, AdminPageQuery } from "../../../services/AdminQueryModel";
import { buildTableCsv, shareText } from "../../../services/ExportService";
import { type AdminColumn, AdminTable } from "../AdminTable";

jest.mock("../../../services/ExportService", () => ({
    buildTableCsv: jest.fn(() => "csv"),
    shareText: jest.fn(() => Promise.resolve()),
}));

type Row = { id: string; name: string };

const columns: AdminColumn<Row>[] = [
    { title: "Name", value: (row) => row.name, field: "name", searchFields: ["name"] },
    { title: "ID", value: (row) => row.id, hidden: true, field: "id" },
];

type RenderOptions = {
    storageKey?: string;
    selectable?: boolean;
    dataSource?: AdminDataSource<Row>;
    onDownloadSelected?: (rows: Row[]) => Promise<void>;
};

const renderTable = (rows: Row[], options: RenderOptions = {}) =>
    render(
        <AdminTable
            columns={columns}
            rows={rows}
            loading={false}
            emptyText={"No rows found."}
            exportTitle={"Users"}
            keyExtractor={(row) => row.id}
            storageKey={options.storageKey}
            selectable={options.selectable}
            dataSource={options.dataSource}
            onDownloadSelected={options.onDownloadSelected}
        />,
    );

describe("AdminTable", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders only the visible column headers", () => {
        const { getByText, queryByText } = renderTable([{ id: "1", name: "Jane" }]);

        expect(getByText("Name")).toBeTruthy();
        expect(queryByText("ID")).toBeNull();
    });

    it("shares all columns, including hidden ones, as CSV", async () => {
        const { getByText } = renderTable([{ id: "1", name: "Jane" }]);

        fireEvent.press(getByText("Share CSV"));

        await waitFor(() => {
            expect(shareText).toHaveBeenCalledWith("Users", "csv");
        });
        expect(buildTableCsv).toHaveBeenCalledWith(["Name", "ID"], [["Jane", "1"]]);
    });

    it("shows a hidden column from the column menu", () => {
        const { getByTestId, getByText } = renderTable([{ id: "1", name: "Jane" }]);

        fireEvent.press(getByTestId("admin-columns-button"));
        fireEvent.press(getByTestId("admin-column-ID"));
        fireEvent.press(getByTestId("admin-columns-button"));

        expect(getByText("ID")).toBeTruthy();
    });

    it("keeps at least one column visible", () => {
        const { getByTestId, getByText } = renderTable([{ id: "1", name: "Jane" }]);

        fireEvent.press(getByTestId("admin-columns-button"));
        fireEvent.press(getByTestId("admin-column-Name"));
        fireEvent.press(getByTestId("admin-columns-button"));

        expect(getByText("Name")).toBeTruthy();
    });

    it("restores the column visibility saved for the same table", async () => {
        const first = renderTable([{ id: "1", name: "Jane" }], {
            storageKey: "admin-table-test",
        });
        fireEvent.press(first.getByTestId("admin-columns-button"));
        fireEvent.press(first.getByTestId("admin-column-ID"));
        first.unmount();

        const second = renderTable([{ id: "1", name: "Jane" }], {
            storageKey: "admin-table-test",
        });

        await waitFor(() => {
            expect(second.getByText("ID")).toBeTruthy();
        });
    });

    it("shares the rows selected from the header as CSV", async () => {
        const rows = [
            { id: "1", name: "Jane" },
            { id: "2", name: "John" },
        ];
        const { getByTestId, getByText } = renderTable(rows, { selectable: true });

        fireEvent.press(getByTestId("admin-select-all"));
        expect(getByText("2 selected")).toBeTruthy();

        fireEvent.press(getByTestId("admin-share-selected-button"));

        await waitFor(() => {
            expect(shareText).toHaveBeenCalledWith("Users", "csv");
        });
        expect(buildTableCsv).toHaveBeenCalledWith(
            ["Name", "ID"],
            [
                ["Jane", "1"],
                ["John", "2"],
            ],
        );
    });

    it("downloads the selected rows", async () => {
        const rows = [
            { id: "1", name: "Jane" },
            { id: "2", name: "John" },
        ];
        const onDownloadSelected = jest.fn(async () => {});
        const { getByTestId } = renderTable(rows, {
            selectable: true,
            onDownloadSelected,
        });

        fireEvent.press(getByTestId("admin-select-all"));
        fireEvent.press(getByTestId("admin-download-selected-button"));

        await waitFor(() => {
            expect(onDownloadSelected).toHaveBeenCalledWith(rows);
        });
    });

    it("clears the selection", () => {
        const rows = [
            { id: "1", name: "Jane" },
            { id: "2", name: "John" },
        ];
        const { getByTestId, getByText, queryByText } = renderTable(rows, { selectable: true });

        fireEvent.press(getByTestId("admin-select-all"));
        expect(getByText("2 selected")).toBeTruthy();

        fireEvent.press(getByTestId("admin-clear-selection-button"));

        expect(queryByText("2 selected")).toBeNull();
    });

    it("selects all only within the search result", async () => {
        const rows = [
            { id: "1", name: "Jane" },
            { id: "2", name: "John" },
        ];
        const { getByPlaceholderText, getByTestId, getByText } = renderTable(rows, {
            selectable: true,
        });

        fireEvent.changeText(getByPlaceholderText("Search"), "Jane");
        fireEvent.press(getByTestId("admin-select-all"));
        expect(getByText("1 selected")).toBeTruthy();

        fireEvent.press(getByTestId("admin-share-selected-button"));

        await waitFor(() => {
            expect(shareText).toHaveBeenCalledWith("Users", "csv");
        });
        expect(buildTableCsv).toHaveBeenCalledWith(["Name", "ID"], [["Jane", "1"]]);
    });

    it("loads pages from the data source", async () => {
        const fetchPage = jest.fn(async ({ pageIndex }: AdminPageQuery) => ({
            rows: pageIndex === 0 ? [{ id: "1", name: "Jane" }] : [{ id: "2", name: "John" }],
            total: 25,
        }));
        const dataSource: AdminDataSource<Row> = {
            fetchPage,
            fetchAll: jest.fn(async () => []),
        };
        const { getByText } = renderTable([], { dataSource });

        await waitFor(() => {
            expect(fetchPage).toHaveBeenCalled();
        });
        expect(fetchPage.mock.calls[0][0]).toMatchObject({
            pageIndex: 0,
            pageSize: 20,
            search: "",
            searchFields: ["name"],
        });
        await waitFor(() => {
            expect(getByText("1 / 2")).toBeTruthy();
        });

        fireEvent.press(getByText("Next ›"));

        await waitFor(() => {
            expect(fetchPage).toHaveBeenLastCalledWith(expect.objectContaining({ pageIndex: 1 }));
        });
    });

    it("passes the search text to the data source", async () => {
        const fetchPage = jest.fn(async () => ({ rows: [], total: 0 }));
        const { getByPlaceholderText } = renderTable([], {
            dataSource: { fetchPage, fetchAll: jest.fn(async () => []) },
        });
        await waitFor(() => {
            expect(fetchPage).toHaveBeenCalledTimes(1);
        });

        fireEvent.changeText(getByPlaceholderText("Search"), "Jane");

        await waitFor(() => {
            expect(fetchPage).toHaveBeenLastCalledWith(
                expect.objectContaining({ search: "Jane", pageIndex: 0 }),
            );
        });
    });

    it("requests the server sort from the column header", async () => {
        const fetchPage = jest.fn(async () => ({ rows: [], total: 0 }));
        const { getByText } = renderTable([], {
            dataSource: { fetchPage, fetchAll: jest.fn(async () => []) },
        });
        await waitFor(() => {
            expect(fetchPage).toHaveBeenCalledTimes(1);
        });

        fireEvent.press(getByText("Name"));

        await waitFor(() => {
            expect(fetchPage).toHaveBeenLastCalledWith(
                expect.objectContaining({ sort: { field: "name", ascending: true } }),
            );
        });
    });

    it("fetches every matched row when sharing CSV in server mode", async () => {
        const fetchPage = jest.fn(async () => ({ rows: [], total: 2 }));
        const fetchAll = jest.fn(async () => [
            { id: "1", name: "Jane" },
            { id: "2", name: "John" },
        ]);
        const { getByText } = renderTable([], {
            dataSource: { fetchPage, fetchAll },
        });

        fireEvent.press(getByText("Share CSV"));

        await waitFor(() => {
            expect(fetchAll).toHaveBeenCalledWith(
                expect.objectContaining({ search: "", searchFields: ["name"] }),
            );
        });
        await waitFor(() => {
            expect(shareText).toHaveBeenCalledWith("Users", "csv");
        });
        expect(buildTableCsv).toHaveBeenCalledWith(
            ["Name", "ID"],
            [
                ["Jane", "1"],
                ["John", "2"],
            ],
        );
    });
});
