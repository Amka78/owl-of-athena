//#region Import Modules
import React, { FunctionComponent } from "react";

import {
    Button,
    ButtonProps,
    ContentTitle,
    ContentTitleProps,
    ErrorText,
    ErrorTextProps,
    LabeledCheckBox,
    LabeledCheckBoxProps,
    StandardView,
    ValidatableTextBox,
    ValidatableTextBoxProps,
} from "../../components";
import { Colors } from "../../constants";
//#endregion

//#region Types
export type SignupScreenTemplateProps = {
    contentTitle: ContentTitleProps;
    emailTextBox: ValidatableTextBoxProps;
    passwordTextBox: ValidatableTextBoxProps;
    passwordConfirmTextBox: ValidatableTextBoxProps;
    labeledCheckBox: LabeledCheckBoxProps;
    errorText: ErrorTextProps;
    signupButton: ButtonProps;
};
//#endregion

//#region Component
export const SignupScreenTemplate: FunctionComponent<SignupScreenTemplateProps> = (
    props: SignupScreenTemplateProps
) => {
    return (
        <StandardView>
            <ContentTitle {...props.contentTitle}></ContentTitle>
            <ValidatableTextBox
                {...props.emailTextBox}
                keyboardType={"email-address"}
            ></ValidatableTextBox>
            <ValidatableTextBox
                {...props.passwordTextBox}
                secureTextEntry={true}
            ></ValidatableTextBox>
            <ValidatableTextBox
                {...props.passwordConfirmTextBox}
                secureTextEntry={true}
            ></ValidatableTextBox>
            <LabeledCheckBox
                {...props.labeledCheckBox}
                labelPlace={"right"}
                labelStyle={{ color: Colors.cyan }}
                container={{ justifyContent: "center" }}
            ></LabeledCheckBox>
            <ErrorText {...props.errorText}></ErrorText>
            <Button {...props.signupButton}></Button>
        </StandardView>
    );
};
//#endregion
