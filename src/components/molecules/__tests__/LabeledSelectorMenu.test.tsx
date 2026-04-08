import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { LabeledSelectorMenu } from "../LabeledSelectorMenu";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("LabeledSelectorMenu", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(
            <LabeledSelectorMenu label="Language" value="English" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders label and value text", () => {
        const { getByText } = renderWithProvider(
            <LabeledSelectorMenu label="Language" value="English" />,
        );
        expect(getByText("Language")).toBeTruthy();
        expect(getByText("English")).toBeTruthy();
    });

    it("calls onPress when tapped", () => {
        const onPress = jest.fn();
        const { getByText } = renderWithProvider(
            <LabeledSelectorMenu label="Language" value="English" onPress={onPress} />,
        );
        fireEvent.press(getByText("Language"));
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});
