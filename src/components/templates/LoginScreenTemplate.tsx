//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import {
    Button,
    ContentTitle,
    ContentTitleProps,
    ErrorText,
    ErrorTextProps,
    FlatButton,
    StandardView,
    TextBox,
    TextBoxProps,
} from "..";
import { Message, MessageKeys } from "../../constants";
import { useLocale } from "../../hooks";
import { TemplateButtonProps } from "./TempatedProps";
//#endregion

//#region Types
export type LoginScreenTemplateProps = {
    contentTitle?: ContentTitleProps;
    email: TextBoxProps;
    password: TextBoxProps;
    errorText: ErrorTextProps;
    loginButton: TemplateButtonProps;
    forgotPasswordButton: TemplateButtonProps;
    signupButton: TemplateButtonProps;
    locale?: string;
};
//#endregion

//#region Component
export const LoginScreenTemplate: FunctionComponent<LoginScreenTemplateProps> = (
    props: LoginScreenTemplateProps
) => {
    useLocale(props.locale);
    return (
        <StandardView>
            <ContentTitle>{Message.get(MessageKeys.login_title)}</ContentTitle>
            <View style={{ flex: 1 }}>
                <TextBox
                    {...props.email}
                    label={Message.get(MessageKeys.login_input_email)}
                    keyboardType={"email-address"}
                ></TextBox>
            </View>
            <View style={{ flex: 1 }}>
                <TextBox
                    {...props.password}
                    secureTextEntry={true}
                    label={Message.get(MessageKeys.login_input_password)}
                ></TextBox>
            </View>
            <ErrorText {...props.errorText}></ErrorText>
            <Button {...props.loginButton}>
                {Message.get(MessageKeys.login_button)}
            </Button>
            <FlatButton {...props.forgotPasswordButton}>
                {Message.get(MessageKeys.login_forgot_password_button)}
            </FlatButton>
            <FlatButton {...props.signupButton}>
                {Message.get(MessageKeys.login_no_account_button)}
            </FlatButton>
        </StandardView>
    );
};
//#endregion
