import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { LabeledCheckBox } from "../LabeledCheckBox";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("LabeledCheckBox", () => {
    it("renders correctly with label on right", () => {
        const { toJSON } = renderWithProvider(
            <LabeledCheckBox label="Accept terms" status="unchecked" labelPlace="right" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders label text", () => {
        const { getByText } = renderWithProvider(
            <LabeledCheckBox label="Enable option" status="checked" labelPlace="right" />,
        );
        expect(getByText("Enable option")).toBeTruthy();
    });

    it("renders description when provided", () => {
        const { getByText } = renderWithProvider(
            <LabeledCheckBox
                label="Option"
                description="This enables the feature"
                status="unchecked"
                labelPlace="right"
            />,
        );
        expect(getByText("This enables the feature")).toBeTruthy();
    });

    it("calls onPress when checkbox is pressed", () => {
        const onPress = jest.fn();
        const { UNSAFE_getByType } = renderWithProvider(
            <LabeledCheckBox
                label="Press me"
                status="unchecked"
                labelPlace="right"
                onPress={onPress}
            />,
        );
        const { Checkbox } = require("react-native-paper");
        const checkbox = UNSAFE_getByType(Checkbox);
        fireEvent(checkbox, "press");
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("calls onLabelPress when label is pressed", () => {
        const onLabelPress = jest.fn();
        const { getByText } = renderWithProvider(
            <LabeledCheckBox
                label="Press label"
                status="unchecked"
                labelPlace="right"
                onLabelPress={onLabelPress}
            />,
        );
        fireEvent.press(getByText("Press label"));
        expect(onLabelPress).toHaveBeenCalledTimes(1);
    });
});
