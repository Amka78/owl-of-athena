//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import React, { FunctionComponent, useLayoutEffect } from "react";
import { View } from "react-native";

import {
    Button,
    ContentText,
    ContentTitle,
    ErrorText,
    ErrorTextProps,
    FlexSpacer,
    StandardView,
    TextBox,
} from "../atoms";
import { Dimens, Message, MessageKeys } from "../../constants";
import { useLocale, useTextBoxReturn, useWindowDimensions } from "../../hooks";
import { TemplateButtonProps } from "./TempatedProps";
//#endregion

//#region Type
export type ForgotPasswordScreenTemplateProps = {
    emailAddress: useTextBoxReturn;
    errorText: ErrorTextProps;
    forgotPasswordButton: TemplateButtonProps;
    cancelButton: TemplateButtonProps;
    locale?: string;
};
//#endregion

//#region Component
export const ForgotPasswordScreenTemplate: FunctionComponent<ForgotPasswordScreenTemplateProps> = (
    props: ForgotPasswordScreenTemplateProps
) => {
    useLocale(props.locale);
    const { setOptions } = useNavigation();
    const dimens = useWindowDimensions();
    useLayoutEffect(() => {
        setOptions({
            headerTitle: Message.get(MessageKeys.forgot_password_title),
            headerShown: !dimens.isDesktop && !dimens.isSmallHeight,
        });
    }, [dimens.isDesktop, dimens.isSmallHeight, setOptions]);

    const contentTitle = dimens.isDesktop ? (
        <ContentTitle>
            {Message.get(MessageKeys.forgot_password_title)}
        </ContentTitle>
    ) : undefined;

    const forgotPasswordButton = (
        <Button
            {...props.forgotPasswordButton}
            style={{
                marginRight: dimens.isLargeWidth
                    ? Dimens.button_margin
                    : undefined,
            }}
        >
            {Message.get(MessageKeys.forgot_password_button)}
        </Button>
    );

    const cancelButton = (
        <Button
            {...props.cancelButton}
            style={{
                marginLeft: dimens.isLargeWidth
                    ? Dimens.button_margin
                    : undefined,
            }}
        >
            {Message.get(MessageKeys.cancel)}
        </Button>
    );

    let bottomButtons;
    if (dimens.isDesktop || dimens.isSmallHeight) {
        bottomButtons = (
            <View style={{ flexDirection: "row" }}>
                {forgotPasswordButton}
                {cancelButton}
            </View>
        );
    } else {
        bottomButtons = forgotPasswordButton;
    }

    return (
        <StandardView
            standardViewStyle={{
                maxHeight: Dimens.inner_screen_max_height,
                maxWidth: Dimens.inner_screen_max_width,
            }}
        >
            {contentTitle}
            <FlexSpacer></FlexSpacer>
            <ContentText>
                {Message.get(MessageKeys.forgot_password_text)}
            </ContentText>
            <FlexSpacer></FlexSpacer>
            <TextBox
                {...props.emailAddress}
                keyboardType={"email-address"}
            ></TextBox>
            <ErrorText {...props.errorText}></ErrorText>
            {bottomButtons}
        </StandardView>
    );
};
//#endregion
