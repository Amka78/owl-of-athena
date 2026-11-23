//#region Import Modules

import { render } from "@testing-library/react-native";
import type React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Provider } from "react-native-paper";
import { Dimens, Theme } from "../../../constants";
import { Button } from "../Button";

//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

// StyleSheet.flatten はこのテスト環境では配列を深くマージしないため、
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
describe("Button UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<Button screenWidth={375}>Test</Button>);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders in disabled state", () => {
        const { toJSON } = renderWithProvider(
            <Button screenWidth={375} disabled={true}>
                Test
            </Button>,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("spreads the content to the button height on web", () => {
        const originalOS = Platform.OS;
        (Platform as { OS: string }).OS = "web";
        try {
            const { UNSAFE_getAllByType } = renderWithProvider(
                <Button screenWidth={375}>Test</Button>,
            );
            const content = UNSAFE_getAllByType(View).find(
                (node) => StyleSheet.flatten(node.props.style)?.flexDirection === "row",
            );
            expect(StyleSheet.flatten(content?.props.style)).toMatchObject({
                minHeight: Dimens.button_height,
            });
        } finally {
            (Platform as { OS: string }).OS = originalOS;
        }
    });

    it("keeps the label line height at least the font size", () => {
        const { getByText } = renderWithProvider(<Button screenWidth={375}>Test</Button>);
        const style = mergedStyle(getByText("Test").props.style);
        expect(style.lineHeight).toBe(Dimens.button_text_line_height);
        expect((style.lineHeight as number) ?? 0).toBeGreaterThanOrEqual(style.fontSize as number);
    });
});
//#endregion
