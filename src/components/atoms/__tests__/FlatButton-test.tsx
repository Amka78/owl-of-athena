/* eslint-disable @typescript-eslint/ban-ts-comment */
//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { FlatButton, FlatButtonProps } from "../FlatButton";
import { useTheme } from "react-native-paper";
import { Colors } from "../../../constants";
import { Theme } from "react-native-paper/lib/typescript/types";
//#endregion

//#region Test
let component: ShallowWrapper<FlatButtonProps, unknown, unknown>;
jest.mock("react-native-paper");
const useThemeMock = useTheme as jest.Mock<Theme>;
describe("FlatButton UnitTest", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    it("Renders correctly", () => {
        component = createMock(<FlatButton>{"test"}</FlatButton>);

        expect(toJson(component)).toMatchSnapshot();
    });
    it("Overwrite styles", () => {
        // @ts-ignore
        useThemeMock.mockReturnValue({ colors: { text: Colors.red } });
        component = createMock(
            <FlatButton
                contentStyle={{ marginTop: 0 }}
                labelStyle={{ marginTop: 0 }}
            >
                {"test"}
            </FlatButton>
        );

        const props = component.props();
        const labelStyle = props.labelStyle as any;
        const contentStyle = props.contentStyle as any;

        expect(labelStyle[2].marginTop).toBe(0);
        expect(labelStyle[1].color).toBe(Colors.red);
        expect(contentStyle[1].marginTop).toBe(0);
    });
});
//#endregion
