import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import type React from "react";
import { Linking } from "react-native";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import IssueService from "../../../services/IssueService";
import { IssueLogDialog } from "../IssueLogDialog";

jest.mock("../../../services/IssueService", () => ({
    __esModule: true,
    default: {
        getAttachments: jest.fn(),
    },
}));

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

    it("shows attachments and opens the signed URL", async () => {
        (IssueService.getAttachments as jest.Mock).mockResolvedValue([
            {
                id: "a1",
                issue_id: "issue-1",
                storage_path: "user-1/shot.png",
                file_name: "shot.png",
                url: "https://example.com/shot.png",
            },
        ]);
        const openURL = jest.spyOn(Linking, "openURL").mockResolvedValue(true as any);
        const { getByText } = renderWithProvider(<IssueLogDialog />);

        await act(async () => {
            IssueLogDialog.show({ title: "With file", logs: "", issueId: "issue-1" });
        });
        expect(IssueService.getAttachments).toHaveBeenCalledWith("issue-1");

        await waitFor(() => {
            expect(getByText("Attachments")).toBeTruthy();
        });
        expect(getByText("shot.png")).toBeTruthy();

        fireEvent.press(getByText("shot.png"));

        expect(openURL).toHaveBeenCalledWith("https://example.com/shot.png");
        openURL.mockRestore();
    });

    it("closes when the OK button is pressed", async () => {
        const { getByText, queryByText } = renderWithProvider(<IssueLogDialog />);

        await showDialog();
        fireEvent.press(getByText("OK"));

        expect(queryByText("Crash on launch")).toBeNull();
    });
});
