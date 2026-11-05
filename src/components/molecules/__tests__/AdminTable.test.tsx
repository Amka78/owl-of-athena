import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { buildTableCsv, shareText } from "../../../services/ExportService";
import { type AdminColumn, AdminTable } from "../AdminTable";

jest.mock("../../../services/ExportService", () => ({
    buildTableCsv: jest.fn(() => "csv"),
    shareText: jest.fn(() => Promise.resolve()),
}));

type Row = { id: string; name: string };

const columns: AdminColumn<Row>[] = [
    { title: "Name", value: (row) => row.name },
    { title: "ID", value: (row) => row.id, hidden: true },
];

const renderTable = (rows: Row[]) =>
    render(
        <AdminTable
            columns={columns}
            rows={rows}
            loading={false}
            emptyText={"No rows found."}
            exportTitle={"Users"}
            keyExtractor={(row) => row.id}
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
});
