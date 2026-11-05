import { act, fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { IssueLogDialog } from "../IssueLogDialog";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const showDialog = async (): Promise<void> => {
    await act(async () => {
        IssueLogDialog.show({ title: "Crash on launch", logs: "line 1\nline 2" });
    });
};

describe("IssueLogDialog", () => {
    it("shows the full log when opened", async () => {
        const { getByText, queryByText } = renderWithProvider(<IssueLogDialog />);

        expect(queryByText("Crash on launch")).toBeNull();

        await showDialog();

        expect(getByText("Crash on launch")).toBeTruthy();
        expect(getByText("line 1\nline 2")).toBeTruthy();
    });

    it("closes when the OK button is pressed", async () => {
        const { getByText, queryByText } = renderWithProvider(<IssueLogDialog />);

        await showDialog();
        fireEvent.press(getByText("OK"));

        expect(queryByText("Crash on launch")).toBeNull();
    });
});
