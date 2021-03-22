//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import React, { FunctionComponent, useLayoutEffect } from "react";
import { View } from "react-native";

import { Dimens, Message, MessageKeys } from "../../constants";
import {
    useConvertibleHeader,
    useLocale,
    useWindowDimensions,
} from "../../hooks";
import { useTextBoxReturn } from "../../hooks/useTextBox";
import {
    ContentText,
    ErrorText,
    FlexSpacer,
    LeftSideButton,
    TextBox,
} from "../atoms";
import { ErrorTextProps } from "../atoms/ErrorText";
import {
    ConvertibleContentTitle,
    InternalView,
    RightSideButton,
} from "../molecules";
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
        <InternalView>
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
        </InternalView>
    );
};
//#endregion
