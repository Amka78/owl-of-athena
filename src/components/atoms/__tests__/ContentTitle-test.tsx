/* eslint-disable @typescript-eslint/ban-ts-comment */
//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { ContentTitle, ContentTitleProps } from "../ContentTitle";
import { useTheme } from "react-native-paper";
import { Colors } from "../../../constants";
import { Theme } from "react-native-paper/lib/typescript/types";
//#endregion

//#region Test
let component: ShallowWrapper<ContentTitleProps, unknown, unknown>;
jest.mock("react-native-paper");
const useThemeMock = useTheme as jest.Mock<Theme>;
describe("ContentTitle UnitTest", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    it("Renders correctly", () => {
        component = createMock(<ContentTitle>{"test"}</ContentTitle>);

        expect(toJson(component)).toMatchSnapshot();
    });

    it("Overwrite styles", () => {
        // @ts-ignore
        useThemeMock.mockReturnValue({ colors: { accent: Colors.red } });
        component = createMock(
            <ContentTitle style={{ marginTop: 0 }}>{"test"}</ContentTitle>
        );

        const style = component.props().style as any;

        expect(style[2].marginTop).toBe(0);
        expect(style[1].color).toBe(Colors.red);
    });
});
//#endregion
