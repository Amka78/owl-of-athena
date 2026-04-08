//#region Import Modules
import React, { type FunctionComponent } from "react";
import { View } from "react-native";

import { Message, MessageKeys } from "../../constants";
import { useConvertibleHeader, useLocale } from "../../hooks";
import type { Dimensions } from "../../hooks/useWindowDimensions";
import { ErrorText, FlatButton, LeftSideButton, TextBox } from "../atoms";
import type { ContentTitleProps } from "../atoms/ContentTitle";
import type { ErrorTextProps } from "../atoms/ErrorText";
import type { TextBoxProps } from "../atoms/TextBox";
import { ConvertibleContentTitle, InternalView, RightSideButton } from "../molecules";
import type { TemplateButtonProps } from "./TempatedProps";
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
    dimens: Dimensions;
    locale?: string;
};
//#endregion

//#region Component
export const LoginScreenTemplate: FunctionComponent<LoginScreenTemplateProps> = (
    props: LoginScreenTemplateProps,
) => {
    useLocale(props.locale);

    useConvertibleHeader(
        MessageKeys.login_title,
        props.dimens.isDesktop,
        props.dimens.isSmallHeight,
    );

    const loginButton = (
        <LeftSideButton
            {...props.loginButton}
            needMargin={props.dimens.isLargeWidth}
            screenWidth={props.dimens.width}
        >
            {Message.get(MessageKeys.login_button)}
        </LeftSideButton>
    );
    const cancelButton = (
        <RightSideButton
            {...props.cancelButton}
            needMargin={props.dimens.isLargeWidth}
            screenWidth={props.dimens.width}
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
    if (props.dimens.isDesktop || props.dimens.isSmallHeight) {
        buttonView = (
            <View>
                <View style={{ flexDirection: "row" }}>
                    {loginButton}
                    {cancelButton}
                </View>
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
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
            <ConvertibleContentTitle isDesktop={props.dimens.isDesktop}>
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
