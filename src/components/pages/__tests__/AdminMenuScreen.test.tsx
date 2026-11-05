import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { AdminMenuScreen } from "../AdminMenuScreen";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("AdminMenuScreen", () => {
    it("lists every admin section", () => {
        const { getByText } = renderWithProvider(<AdminMenuScreen />);

        expect(getByText("Users")).toBeTruthy();
        expect(getByText("Orders")).toBeTruthy();
        expect(getByText("Sessions")).toBeTruthy();
        expect(getByText("Issues")).toBeTruthy();
        expect(getByText("Messages")).toBeTruthy();
    });

    it("does not expose the legacy app settings screen", () => {
        const { queryByText } = renderWithProvider(<AdminMenuScreen />);

        expect(queryByText("App Settings")).toBeNull();
    });

    it("handles a menu press", () => {
        const { getByText } = renderWithProvider(<AdminMenuScreen />);

        fireEvent.press(getByText("Users"));
    });
});
