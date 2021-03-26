/* eslint-disable @typescript-eslint/ban-ts-comment */
//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { ErrorText, ErrorTextProps } from "../ErrorText";
import { useTheme } from "react-native-paper";
import { Colors } from "../../../constants";
import { Theme } from "react-native-paper/lib/typescript/types";
//#endregion

//#region Test
let component: ShallowWrapper<ErrorTextProps, unknown, unknown>;
jest.mock("react-native-paper");
const useThemeMock = useTheme as jest.Mock<Theme>;
describe("ErrorText UnitTest", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    it("Renders correctly", () => {
        component = createMock(<ErrorText>{"test"}</ErrorText>);

        expect(toJson(component)).toMatchSnapshot();
    });

    it("Overwrite styles", () => {
        // @ts-ignore
        useThemeMock.mockReturnValue({ colors: { error: Colors.red } });
        component = createMock(
            <ErrorText style={{ marginTop: 0 }}>{"test"}</ErrorText>
        );

        const style = component.props().style as any;

        expect(style[2].marginTop).toBe(0);
        expect(style[1].color).toBe(Colors.red);
    });
});
//#endregion
