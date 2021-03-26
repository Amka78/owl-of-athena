//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import { Message, MessageKeys } from "../../constants";
import { useConvertibleHeader, useLocale } from "../../hooks";
import { useTextBoxReturn } from "../../hooks/useTextBox";
import { Dimensions } from "../../hooks/useWindowDimensions";
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
    dimens: Dimensions;
    locale?: string;
};
//#endregion

//#region Component
export const ForgotPasswordScreenTemplate: FunctionComponent<ForgotPasswordScreenTemplateProps> = (
    props: ForgotPasswordScreenTemplateProps
) => {
    useLocale(props.locale);

    useConvertibleHeader(
        MessageKeys.forgot_password_title,
        props.dimens.isDesktop,
        props.dimens.isSmallHeight
    );

    const forgotPasswordButton = (
        <LeftSideButton
            {...props.forgotPasswordButton}
            needMargin={props.dimens.isLargeWidth}
            screenWidth={props.dimens.width}
        >
            {Message.get(MessageKeys.forgot_password_button)}
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

    let bottomButtons;
    if (props.dimens.isDesktop || props.dimens.isSmallHeight) {
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
            <ConvertibleContentTitle isDesktop={props.dimens.isDesktop}>
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
