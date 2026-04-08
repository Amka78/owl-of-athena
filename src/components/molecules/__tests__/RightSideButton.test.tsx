import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { RightSideButton } from "../RightSideButton";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("RightSideButton", () => {
    it("renders correctly with margin", () => {
        const { toJSON } = renderWithProvider(
            <RightSideButton needMargin={true} screenWidth={375}>
                Save
            </RightSideButton>,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders button text", () => {
        const { getByText } = renderWithProvider(
            <RightSideButton needMargin={false} screenWidth={375}>
                Cancel
            </RightSideButton>,
        );
        expect(getByText("Cancel")).toBeTruthy();
    });

    it("calls onPress when pressed", () => {
        const onPress = jest.fn();
        const { getByText } = renderWithProvider(
            <RightSideButton needMargin={true} screenWidth={375} onPress={onPress}>
                Save
            </RightSideButton>,
        );
        fireEvent.press(getByText("Save"));
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});
