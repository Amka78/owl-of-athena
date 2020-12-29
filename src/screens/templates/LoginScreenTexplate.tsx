//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import {
    Button,
    ButtonProps,
    ContentTitle,
    ContentTitleProps,
    ErrorText,
    ErrorTextProps,
    FlatButton,
    StandardView,
    TextBox,
    TextBoxProps,
} from "../../components";
//#endregion

//#region Types
export type LoginScreenTeplateProps = {
    contentTitle: ContentTitleProps;
    email: TextBoxProps;
    password: TextBoxProps;
    errorText: ErrorTextProps;
    loginButton: ButtonProps;
    forgotPasswordButton: ButtonProps;
    signupButton: ButtonProps;
};
//#endregion

//#region Component
export const LoginScreenTemplate: FunctionComponent<LoginScreenTeplateProps> = (
    props: LoginScreenTeplateProps
) => {
    return (
        <StandardView>
            <ContentTitle {...props.contentTitle}></ContentTitle>
            <View style={{ flex: 1 }}>
                <TextBox
                    {...props.email}
                    keyboardType={"email-address"}
                ></TextBox>
            </View>
            <View style={{ flex: 1 }}>
                <TextBox {...props.password} secureTextEntry={true}></TextBox>
            </View>
            <ErrorText {...props.errorText}></ErrorText>
            <Button {...props.loginButton}></Button>
            <FlatButton {...props.forgotPasswordButton}></FlatButton>
            <FlatButton {...props.signupButton}></FlatButton>
        </StandardView>
    );
};
//#endregion
