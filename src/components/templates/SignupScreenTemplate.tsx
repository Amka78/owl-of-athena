//#region Import Modules
import React, { FunctionComponent } from "react";

import {
    LabeledCheckBox,
    LabeledCheckBoxProps,
    ValidatableTextBox,
    ValidatableTextBoxProps,
} from "../molecules";
import { Colors, Message, MessageKeys } from "../../constants";
import { useLocale } from "../../hooks";
import {
    Button,
    ContentTitle,
    ContentTitleProps,
    ErrorText,
    ErrorTextProps,
    StandardView,
} from "../atoms";
import { TemplateButtonProps } from "./TempatedProps";
//#endregion

//#region Types
export type SignupScreenTemplateProps = {
    contentTitle?: ContentTitleProps;
    emailTextBox: ValidatableTextBoxProps;
    passwordTextBox: ValidatableTextBoxProps;
    passwordConfirmTextBox: ValidatableTextBoxProps;
    labeledCheckBox: LabeledCheckBoxProps;
    errorText: ErrorTextProps;
    signupButton: TemplateButtonProps;
    locale?: string;
};
//#endregion

//#region Component
export const SignupScreenTemplate: FunctionComponent<SignupScreenTemplateProps> = (
    props: SignupScreenTemplateProps
) => {
    useLocale(props.locale);
    return (
        <StandardView>
            <ContentTitle {...props.contentTitle}>
                {Message.get(MessageKeys.signup_title)}
            </ContentTitle>
            <ValidatableTextBox
                {...props.emailTextBox}
                keyboardType={"email-address"}
                label={Message.get(MessageKeys.signup_input_email)}
            ></ValidatableTextBox>
            <ValidatableTextBox
                {...props.passwordTextBox}
                secureTextEntry={true}
                label={Message.get(MessageKeys.signup_input_password)}
            ></ValidatableTextBox>
            <ValidatableTextBox
                {...props.passwordConfirmTextBox}
                secureTextEntry={true}
                label={Message.get(MessageKeys.signup_input_password_confirm)}
            ></ValidatableTextBox>
            <LabeledCheckBox
                {...props.labeledCheckBox}
                label={Message.get(MessageKeys.signup_terms)}
                labelPlace={"right"}
                labelStyle={{ color: Colors.cyan }}
                container={{ justifyContent: "center" }}
            ></LabeledCheckBox>
            <ErrorText {...props.errorText}></ErrorText>
            <Button {...props.signupButton}>
                {Message.get(MessageKeys.signup_button)}
            </Button>
        </StandardView>
    );
};
//#endregion
