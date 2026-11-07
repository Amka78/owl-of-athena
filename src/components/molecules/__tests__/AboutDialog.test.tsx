import { act, fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { AboutDialog } from "../AboutDialog";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("AboutDialog UnitTest", () => {
    it("renders nothing initially", () => {
        const { queryByText } = renderWithProvider(<AboutDialog />);

        expect(queryByText("Close")).toBeNull();
    });

    it("opens and closes with the close button", async () => {
        const { getByText, queryByText } = renderWithProvider(<AboutDialog />);

        await act(async () => {
            AboutDialog.show();
        });

        expect(getByText("Close")).toBeTruthy();
        expect(getByText("About")).toBeTruthy();

        fireEvent.press(getByText("Close"));

        expect(queryByText("Close")).toBeNull();
    });
});
