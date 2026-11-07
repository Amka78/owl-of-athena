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
});
//#endregion
