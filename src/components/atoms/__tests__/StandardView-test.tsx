/* eslint-disable @typescript-eslint/ban-ts-comment */
//#region Import Modules
import { View } from "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { StandardView, StandardViewProps } from "../StandardView";
import { useTheme } from "react-native-paper";
import { Colors } from "../../../constants";
import { Theme } from "react-native-paper/lib/typescript/types";
//#endregion

//#region Test
let component: ShallowWrapper<StandardViewProps, unknown, unknown>;
jest.mock("react-native-paper");
const useThemeMock = useTheme as jest.Mock<Theme>;
describe("StandardView UnitTest", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it("Renders correctly", () => {
        // @ts-ignore
        useThemeMock.mockReturnValue({ colors: { background: Colors.navy } });
        component = createMock(
            <StandardView>
                <View></View>
            </StandardView>
        );

        expect(toJson(component)).toMatchSnapshot();
    });

    it("Overwrite styles", () => {
        // @ts-ignore
        useThemeMock.mockReturnValue({ colors: { background: Colors.navy } });
        component = createMock(
            <StandardView
                rootViewStyle={{ marginTop: 0 }}
                standardViewStyle={{ marginTop: 0 }}
            >
                <View></View>
            </StandardView>
        );
    });
});
//#endregion
