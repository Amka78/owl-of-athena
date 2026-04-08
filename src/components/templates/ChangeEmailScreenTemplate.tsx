//#region Import Modules
import React, { type FunctionComponent } from "react";
import { View } from "react-native";

import { Colors, Message, MessageKeys } from "../../constants";
import { useConvertibleHeader, useLocale } from "../../hooks";
import type { useTextBoxReturn } from "../../hooks/useTextBox";
import type { Dimensions } from "../../hooks/useWindowDimensions";
import { ContentText, ErrorText, FlexSpacer, LeftSideButton, TextBox } from "../atoms";
import type { ErrorTextProps } from "../atoms/ErrorText";
import { ConvertibleContentTitle, InternalView, RightSideButton } from "../molecules";
import type { TemplateButtonProps } from "./TempatedProps";
//#endregion

//#region Types
export type ChangeEmailScreenTemplateProps = {
    newEmail: useTextBoxReturn;
    confirmEmail: useTextBoxReturn;
    errorText: ErrorTextProps;
    successMessage?: string;
    saveButton: TemplateButtonProps;
    cancelButton: TemplateButtonProps;
    dimens: Dimensions;
    locale?: string;
};
//#endregion

//#region Component
export const ChangeEmailScreenTemplate: FunctionComponent<ChangeEmailScreenTemplateProps> = (
    props: ChangeEmailScreenTemplateProps,
) => {
    useLocale(props.locale);

    useConvertibleHeader(
        MessageKeys.change_email_title,
        props.dimens.isDesktop,
        props.dimens.isSmallHeight,
    );

    const saveButton = (
        <LeftSideButton
            {...props.saveButton}
            needMargin={props.dimens.isLargeWidth}
            screenWidth={props.dimens.width}
        >
            {Message.get(MessageKeys.change_email_button)}
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

    const bottomButtons =
        props.dimens.isDesktop || props.dimens.isSmallHeight ? (
            <View style={{ flexDirection: "row" }}>
                {saveButton}
                {cancelButton}
            </View>
        ) : (
            saveButton
        );

    return (
        <InternalView>
            <ConvertibleContentTitle isDesktop={props.dimens.isDesktop}>
                {Message.get(MessageKeys.change_email_title)}
            </ConvertibleContentTitle>
            <FlexSpacer />
            <ContentText style={{ color: Colors.yellow }}>
                {Message.get(MessageKeys.change_email_warning)}
            </ContentText>
            <FlexSpacer />
            <TextBox
                {...props.newEmail}
                label={Message.get(MessageKeys.change_email_input_new_email)}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextBox
                {...props.confirmEmail}
                label={Message.get(MessageKeys.change_email_input_confirm_email)}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <ErrorText {...props.errorText} />
            {props.successMessage ? (
                <ContentText style={{ color: Colors.cyan }}>{props.successMessage}</ContentText>
            ) : null}
            {bottomButtons}
        </InternalView>
    );
};
//#endregion
