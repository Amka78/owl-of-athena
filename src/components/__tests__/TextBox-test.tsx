import "react-native";
import { ShallowWrapper } from "enzyme";
import React from "react";
import { TestHelper } from "../../utils/TestHelper";
import { Message } from "../../constants";
import { TextBox, TextBoxProps } from "../TextBox";
let component: ShallowWrapper<TextBoxProps, any, any>;
describe("TextBoxEx UnitTest", () => {
    it.each(["ja-JP", "en-US"])("renders correctly", (locale: string) => {
        Message.setLocale(locale);

        component = TestHelper.createMock(<TextBox></TextBox>);

        expect(TestHelper.toJson(component)).toMatchSnapshot();
    });
});
