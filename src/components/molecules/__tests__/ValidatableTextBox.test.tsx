import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { ValidatableTextBox } from "../ValidatableTextBox";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("ValidatableTextBox", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(
            <ValidatableTextBox label="Email" value="test@example.com" helperText="" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders with error helper text", () => {
        const { getByText } = renderWithProvider(
            <ValidatableTextBox label="Email" value="invalid" helperText="Enter a valid email" />,
        );
        expect(getByText("Enter a valid email")).toBeTruthy();
    });

    it("shows label text", () => {
        const { getAllByText } = renderWithProvider(
            <ValidatableTextBox label="Password" value="" helperText="" />,
        );
        expect(getAllByText("Password").length).toBeGreaterThan(0);
    });
});
