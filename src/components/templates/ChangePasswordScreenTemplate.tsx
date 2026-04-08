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
export type ChangePasswordScreenTemplateProps = {
    newPassword: useTextBoxReturn;
    confirmPassword: useTextBoxReturn;
    errorText: ErrorTextProps;
    successMessage?: string;
    saveButton: TemplateButtonProps;
    cancelButton: TemplateButtonProps;
    dimens: Dimensions;
    locale?: string;
};
//#endregion

//#region Component
export const ChangePasswordScreenTemplate: FunctionComponent<ChangePasswordScreenTemplateProps> = (
    props: ChangePasswordScreenTemplateProps,
) => {
    useLocale(props.locale);

    useConvertibleHeader(
        MessageKeys.change_password_title,
        props.dimens.isDesktop,
        props.dimens.isSmallHeight,
    );

    const saveButton = (
        <LeftSideButton
            {...props.saveButton}
            needMargin={props.dimens.isLargeWidth}
            screenWidth={props.dimens.width}
        >
            {Message.get(MessageKeys.change_password_button)}
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
                {Message.get(MessageKeys.change_password_title)}
            </ConvertibleContentTitle>
            <FlexSpacer />
            <ContentText style={{ color: Colors.yellow }}>
                {Message.get(MessageKeys.change_password_warning)}
            </ContentText>
            <FlexSpacer />
            <TextBox
                {...props.newPassword}
                label={Message.get(MessageKeys.change_password_input_new_password)}
                secureTextEntry
            />
            <TextBox
                {...props.confirmPassword}
                label={Message.get(MessageKeys.change_password_input_confirm_password)}
                secureTextEntry
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
