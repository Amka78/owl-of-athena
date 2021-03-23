//#region Import Modules
import "react-native";
import { ShallowWrapper } from "enzyme";
import React from "react";
import { createMock, toJson } from "../../utils/TestHelper";
import { TextBox, TextBoxProps } from "../atoms/TextBox";
//#endregion

//#region Test
let component: ShallowWrapper<TextBoxProps, unknown, unknown>;
describe("TextBoxEx UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(<TextBox></TextBox>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
