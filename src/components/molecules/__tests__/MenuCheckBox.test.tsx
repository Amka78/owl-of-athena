import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { MenuCheckBox } from "../MenuCheckBox";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("MenuCheckBox", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(
            <MenuCheckBox label="Enable feature" status="unchecked" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders label text", () => {
        const { getByText } = renderWithProvider(
            <MenuCheckBox label="Enable feature" status="checked" />,
        );
        expect(getByText("Enable feature")).toBeTruthy();
    });

    it("renders with description", () => {
        const { getByText } = renderWithProvider(
            <MenuCheckBox label="Option" description="Enables the feature" status="unchecked" />,
        );
        expect(getByText("Enables the feature")).toBeTruthy();
    });
});
