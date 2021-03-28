//#region Import Modules
import "react-native";
import { ShallowWrapper } from "enzyme";
import React from "react";
import { createMock, toJson } from "../../../utils/TestHelper";
import { TextBox, TextBoxProps } from "../TextBox";
//#endregion

//#region Test
let component: ShallowWrapper<TextBoxProps, unknown, unknown>;
describe("TextBox UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(<TextBox></TextBox>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
