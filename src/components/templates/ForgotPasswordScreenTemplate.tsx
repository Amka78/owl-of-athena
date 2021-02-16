//#region Import Modules
import React, { FunctionComponent, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";

import {
    ContentText,
    ErrorText,
    ErrorTextProps,
    FlexSpacer,
    StandardView,
    TextBox,
} from "../atoms";
import { Dimens, Message, MessageKeys } from "../../constants";
import {
    useConvertibleHeader,
    useLocale,
    useTextBoxReturn,
    useWindowDimensions,
} from "../../hooks";
import { TemplateButtonProps } from "./TempatedProps";
import {
    ConvertibleContentTitle,
    LeftSideButton,
    RightSideButton,
} from "../molecules";
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
    const dimens = useWindowDimensions();
    const { setOptions } = useNavigation();

    useConvertibleHeader(
        MessageKeys.forgot_password_title,
        dimens.isDesktop,
        dimens.isSmallHeight
    );

    useLayoutEffect(() => {
        setOptions({
            headerTitleStyle: {
                fontSize: Dimens.forgot_password_title_font_size,
            },
        });
    }, [setOptions]);

    const forgotPasswordButton = (
        <LeftSideButton
            {...props.forgotPasswordButton}
            isLargeWidth={dimens.isLargeWidth}
        >
            {Message.get(MessageKeys.forgot_password_button)}
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
            <ConvertibleContentTitle isDesktop={dimens.isDesktop}>
                {Message.get(MessageKeys.forgot_password_title)}
            </ConvertibleContentTitle>
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
