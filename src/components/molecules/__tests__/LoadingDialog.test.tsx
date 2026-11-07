import { act, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
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
});
