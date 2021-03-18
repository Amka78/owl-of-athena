//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import { Message, MessageKeys } from "../../constants";
import {
    useConvertibleHeader,
    useLocale,
    useWindowDimensions,
} from "../../hooks";
import {
    ContentTitleProps,
    ErrorText,
    ErrorTextProps,
    FlatButton,
    LeftSideButton,
    TextBox,
    TextBoxProps,
} from "../atoms";
import {
    ConvertibleContentTitle,
    InternalView,
    RightSideButton,
} from "../molecules";
import { TemplateButtonProps } from "./TempatedProps";
//#endregion

//#region Types
export type LoginScreenTemplateProps = {
    contentTitle?: ContentTitleProps;
    email: TextBoxProps;
    password: TextBoxProps;
    errorText: ErrorTextProps;
    loginButton: TemplateButtonProps;
    cancelButton: TemplateButtonProps;
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

    const dimens = useWindowDimensions();

    useConvertibleHeader(
        MessageKeys.login_title,
        dimens.isDesktop,
        dimens.isSmallHeight
    );

    const loginButton = (
        <LeftSideButton
            {...props.loginButton}
            isLargeWidth={dimens.isLargeWidth}
        >
            {Message.get(MessageKeys.login_button)}
        </LeftSideButton>
    );
    const cancelButton = (
        <RightSideButton
            {...props.cancelButton}
            isLargeWidth={dimens.isLargeWidth}
        >
            {Message.get(MessageKeys.cancel)}
        </RightSideButton>
    );
    const forgotPasswordFlatButton = (
        <FlatButton {...props.forgotPasswordButton}>
            {Message.get(MessageKeys.login_forgot_password_button)}
        </FlatButton>
    );

    const signupFlatButton = (
        <FlatButton {...props.signupButton}>
            {Message.get(MessageKeys.login_no_account_button)}
        </FlatButton>
    );

    let buttonView;
    if (dimens.isDesktop || dimens.isSmallHeight) {
        buttonView = (
            <View>
                <View style={{ flexDirection: "row" }}>
                    {loginButton}
                    {cancelButton}
                </View>
                <View
                    style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                    {forgotPasswordFlatButton}
                    {signupFlatButton}
                </View>
            </View>
        );
    } else {
        buttonView = (
            <View style={{ alignItems: "center" }}>
                {loginButton}
                <View>
                    {forgotPasswordFlatButton}
                    {signupFlatButton}
                </View>
            </View>
        );
    }
    return (
        <InternalView>
            <ConvertibleContentTitle isDesktop={dimens.isDesktop}>
                {Message.get(MessageKeys.login_title)}
            </ConvertibleContentTitle>
            <TextBox
                {...props.email}
                label={Message.get(MessageKeys.login_input_email)}
                keyboardType={"email-address"}
            ></TextBox>
            <TextBox
                {...props.password}
                secureTextEntry={true}
                label={Message.get(MessageKeys.login_input_password)}
            ></TextBox>
            <ErrorText {...props.errorText}></ErrorText>
            {buttonView}
        </InternalView>
    );
};
//#endregion
