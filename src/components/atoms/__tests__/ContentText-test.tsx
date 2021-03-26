/* eslint-disable @typescript-eslint/ban-ts-comment */
//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";
import { useTheme } from "react-native-paper";
import { Theme } from "react-native-paper/lib/typescript/types";

import { Colors } from "../../../constants";
import { createMock, toJson } from "../../../utils/TestHelper";
import { ContentText, ContentTextProps } from "../ContentText";
//#endregion

//#region Test
let component: ShallowWrapper<ContentTextProps, unknown, unknown>;
jest.mock("react-native-paper");
const useThemeMock = useTheme as jest.Mock<Theme>;
describe("ContentText UnitTest", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    it("Renders correctly", () => {
        component = createMock(<ContentText>{"test"}</ContentText>);

        expect(toJson(component)).toMatchSnapshot();
    });
    it("Overwrite styles", () => {
        //@ts-ignore
        useThemeMock.mockReturnValue({ colors: { accent: Colors.red } });
        component = createMock(
            <ContentText style={{ marginTop: 0 }}>{"test"}</ContentText>
        );

        const style = component.props().style as any;

        expect(style[2].marginTop).toBe(0);
        expect(style[1].color).toBe(Colors.red);
    });
});
//#endregion
