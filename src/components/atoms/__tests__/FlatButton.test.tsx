//#region Import Modules

import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Dimens, Theme } from "../../../constants";
import { FlatButton } from "../FlatButton";

//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

// StyleSheet.flatten はこのテスト環境では paper の配列を深くマージしないため、
// 要素順（後勝ち）を保証するマージで実効スタイルを取り出す。
const mergedStyle = (styles: unknown): Record<string, unknown> => {
    const out: Record<string, unknown> = {};
    const walk = (value: unknown): void => {
        if (Array.isArray(value)) {
            for (const item of value) walk(item);
        } else if (value !== null && typeof value === "object") {
            for (const key of Object.keys(value))
                out[key] = (value as Record<string, unknown>)[key];
        }
    };
    walk(styles);
    return out;
};

//#region Tests
describe("FlatButton UnitTest", () => {
    it("renders correctly with children", () => {
        const { toJSON } = renderWithProvider(<FlatButton>Test Button</FlatButton>);
        expect(toJSON()).toMatchSnapshot();
    });

    it("calls onPress when pressed", () => {
        const onPress = jest.fn();
        const { getByText } = renderWithProvider(
            <FlatButton onPress={onPress}>Test Button</FlatButton>,
        );
        fireEvent.press(getByText("Test Button"));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("marks the button as disabled", () => {
        const onPress = jest.fn();
        const { UNSAFE_getByProps } = renderWithProvider(
            <FlatButton onPress={onPress} disabled>
                Test Button
            </FlatButton>,
        );

        expect(UNSAFE_getByProps({ disabled: true })).toBeTruthy();
    });

    it("keeps the label box within the button content height", () => {
        const { getByText } = renderWithProvider(<FlatButton>Test Button</FlatButton>);
        const labelStyle = mergedStyle(getByText("Test Button").props.style);
        const labelBoxHeight =
            (labelStyle.lineHeight as number) + (labelStyle.marginVertical as number) * 2;
        expect(labelStyle.marginVertical).toBe(0);
        expect(labelBoxHeight).toBeLessThanOrEqual(Dimens.button_flat_height);
    });
});
//#endregion
