import "jest-enzyme";
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { Message } from "../../../constants";
import {
    createMock,
    DesktopDimension,
    toJson,
} from "../../../utils/TestHelper";
import {
    SignupScreenTemplate,
    SignupScreenTemplateProps,
} from "../SignupScreenTemplate";
import {
    TemplateLabeledCheckBoxProps,
    TemplateValidateTextBoxProps,
} from "../TempatedProps";

let component: ShallowWrapper<SignupScreenTemplateProps, unknown, unknown>;

describe("SignupScreenTemplate UnitTest", () => {
    it.each(["us", "ja"])("renders correctly", (locale: string) => {
        const testEvent: () => void = () => {
            return;
        };
        Message.setLocale(locale);

        const textProps: TemplateValidateTextBoxProps = {
            errorText: "test",
            onChangeText: () => {
                return;
            },
            value: "test",
        };
        const checkBoxProps: TemplateLabeledCheckBoxProps = {
            status: "checked",
            onLabelPress: () => {
                return;
            },
            onPress: () => {
                return;
            },
        };
        component = createMock(
            <SignupScreenTemplate
                emailTextBox={textProps}
                passwordTextBox={textProps}
                passwordConfirmTextBox={textProps}
                labeledCheckBox={checkBoxProps}
                onSignupPress={testEvent}
                onCancelPress={testEvent}
                errorText={"test"}
                dimens={DesktopDimension}
            ></SignupScreenTemplate>
        );

        expect(toJson(component)).toMatchSnapshot();
    });
});
