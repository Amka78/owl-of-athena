import { act, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { AuroraInstance } from "../../../sdk";
import { AuroraEventList } from "../../../sdk/AuroraEventList";
import { LoadingDialog } from "../LoadingDialog";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("LoadingDialog", () => {
    it("does not show dialog content initially", () => {
        const { queryByText } = renderWithProvider(<LoadingDialog />);
        expect(queryByText("Loading...")).toBeNull();
    });

    it("shows dialog after LoadingDialog.show() is called", async () => {
        const { getByText } = renderWithProvider(<LoadingDialog />);

        await act(async () => {
            LoadingDialog.show({ dialogTitle: "Loading..." });
        });

        expect(getByText("Loading...")).toBeTruthy();
    });

    it("shows a percentage when progress is provided", async () => {
        const { getByText } = renderWithProvider(<LoadingDialog />);

        await act(async () => {
            LoadingDialog.show({ dialogTitle: "Downloading...", progress: 0.5 });
        });

        expect(getByText("50%")).toBeTruthy();
    });

    it("clamps progress to 100%", async () => {
        const { getByText } = renderWithProvider(<LoadingDialog />);

        await act(async () => {
            LoadingDialog.show({ dialogTitle: "Downloading...", progress: 1.5 });
        });

        expect(getByText("100%")).toBeTruthy();
    });

    it("hides dialog after LoadingDialog.close() is called", async () => {
        const { getByText, queryByText } = renderWithProvider(<LoadingDialog />);

        await act(async () => {
            LoadingDialog.show({ dialogTitle: "Please wait" });
        });

        expect(getByText("Please wait")).toBeTruthy();

        await act(async () => {
            LoadingDialog.close();
        });

        expect(queryByText("Please wait")).toBeNull();
    });

    it("keeps the spinner outside Aurora comm mode", async () => {
        const { getByTestId } = renderWithProvider(<LoadingDialog />);

        await act(async () => {
            LoadingDialog.show({ dialogTitle: "Loading..." });
        });

        expect(getByTestId("loading-indicator")).toBeTruthy();
    });

    it("shows the communication log instead of the spinner in Aurora comm mode", async () => {
        const { getByText, queryByTestId } = renderWithProvider(<LoadingDialog />);

        await act(async () => {
            LoadingDialog.show({ dialogTitle: "Syncing...", auroraCommLog: true });
        });

        expect(getByText("AURORA")).toBeTruthy();
        expect(getByText("Waiting for communication…")).toBeTruthy();
        expect(queryByTestId("loading-indicator")).toBeNull();
    });

    it("displays the Aurora command history while open", async () => {
        const { getAllByText, getByText } = renderWithProvider(<LoadingDialog />);

        await act(async () => {
            LoadingDialog.show({ dialogTitle: "Syncing...", auroraCommLog: true });
        });

        await act(async () => {
            AuroraInstance.emit(AuroraEventList.cmdBegin, {
                command: "sd-dir-read",
                args: ["sessions"],
            });
            AuroraInstance.emit(AuroraEventList.cmdEnd, {
                command: "sd-dir-read",
                args: ["sessions"],
                beginTime: 1000,
                endTime: 1024,
                error: false,
                response: {},
            });
        });

        expect(getAllByText(/sd-dir-read/)).toHaveLength(2);
        expect(getByText(/OK 24ms/)).toBeTruthy();
    });

    it("clears the previous history when reopened in comm mode", async () => {
        const { getByText, queryByText, getAllByText } = renderWithProvider(<LoadingDialog />);

        await act(async () => {
            LoadingDialog.show({ dialogTitle: "Syncing...", auroraCommLog: true });
        });
        await act(async () => {
            AuroraInstance.emit(AuroraEventList.cmdBegin, { command: "os-info" });
        });
        expect(getAllByText(/os-info/)).toHaveLength(1);

        await act(async () => {
            LoadingDialog.close();
        });
        await act(async () => {
            LoadingDialog.show({ dialogTitle: "Syncing again...", auroraCommLog: true });
        });

        expect(queryByText(/os-info/)).toBeNull();
        expect(getByText("Waiting for communication…")).toBeTruthy();
    });

    it("keeps the history when the progress is updated while open", async () => {
        const { getAllByText, getByText } = renderWithProvider(<LoadingDialog />);

        await act(async () => {
            LoadingDialog.show({ dialogTitle: "Downloading...", auroraCommLog: true });
        });
        await act(async () => {
            AuroraInstance.emit(AuroraEventList.cmdBegin, { command: "os-info" });
        });
        await act(async () => {
            LoadingDialog.show({
                dialogTitle: "Downloading...",
                auroraCommLog: true,
                progress: 0.5,
            });
        });

        expect(getAllByText(/os-info/)).toHaveLength(1);
        expect(getByText("50%")).toBeTruthy();
    });
});
