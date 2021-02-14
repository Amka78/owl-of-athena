//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import React, { FunctionComponent, useLayoutEffect } from "react";
import { View } from "react-native";

import { Dimens, Message, MessageKeys } from "../../constants";
import { useLocale, useWindowDimensions } from "../../hooks";
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
} from "../atoms";
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

    const { setOptions } = useNavigation();

    const dimens = useWindowDimensions();
    useLayoutEffect(() => {
        setOptions({
            headerTitle: Message.get(MessageKeys.login_title),
            headerShown: !dimens.isDesktop && !dimens.isSmallHeight,
        });
    }, [dimens.isDesktop, dimens.isSmallHeight, setOptions]);
    const allowTwoButtonWidth = dimens.width > Dimens.button_max_width * 2;

    const contentTitle = dimens.isDesktop ? (
        <ContentTitle>{Message.get(MessageKeys.login_title)}</ContentTitle>
    ) : undefined;

    const loginButton = (
        <Button
            {...props.loginButton}
            style={{
                marginRight: allowTwoButtonWidth
                    ? Dimens.button_margin
                    : undefined,
            }}
        >
            {Message.get(MessageKeys.login_button)}
        </Button>
    );
    const forgotPasswordButton = (
        <Button
            {...props.forgotPasswordButton}
            style={{
                marginLeft: allowTwoButtonWidth
                    ? Dimens.button_margin
                    : undefined,
            }}
            labelStyle={{
                alignSelf: "center",
                fontSize: 20,
            }}
        >
            {Message.get(MessageKeys.login_forgot_password_button)}
        </Button>
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
    if (allowTwoButtonWidth) {
        buttonView = (
            <View>
                <View style={{ flexDirection: "row" }}>
                    {loginButton}
                    {forgotPasswordButton}
                </View>
                <View style={{ alignItems: "flex-end" }}>
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
        <StandardView
            standardViewStyle={{
                maxHeight: Dimens.inner_screen_max_height,
                maxWidth: Dimens.inner_screen_max_width,
            }}
        >
            {contentTitle}
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
        </StandardView>
    );
};
//#endregion
