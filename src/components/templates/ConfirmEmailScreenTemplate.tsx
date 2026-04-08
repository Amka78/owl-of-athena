//#region Import Modules
import React, { type FunctionComponent } from "react";
import { Alert, View } from "react-native";

import { Colors, Message, MessageKeys } from "../../constants";
import { useConvertibleHeader, useLocale } from "../../hooks";
import type { Dimensions } from "../../hooks/useWindowDimensions";
import { Button, ContentText, ErrorText, FlexSpacer, LeftSideButton } from "../atoms";
import { ConvertibleContentTitle, InternalView, RightSideButton } from "../molecules";
import type { TemplateButtonProps } from "./TempatedProps";
//#endregion

//#region Types
export type ConfirmEmailScreenTemplateProps = {
    email: string;
    checkButton: TemplateButtonProps;
    resendButton: TemplateButtonProps;
    onChangeEmailPress: (newEmail: string, password: string) => void;
    errorText?: string;
    successMessage?: string;
    dimens: Dimensions;
    locale?: string;
};
//#endregion

//#region Component
export const ConfirmEmailScreenTemplate: FunctionComponent<ConfirmEmailScreenTemplateProps> = (
    props: ConfirmEmailScreenTemplateProps,
) => {
    useLocale(props.locale);
    useConvertibleHeader(
        MessageKeys.confirm_email_title,
        props.dimens.isDesktop,
        props.dimens.isSmallHeight,
    );

    const checkButton = (
        <LeftSideButton
            {...props.checkButton}
            needMargin={props.dimens.isLargeWidth}
            screenWidth={props.dimens.width}
        >
            {Message.get(MessageKeys.confirm_email_check_button)}
        </LeftSideButton>
    );

    const resendButton = (
        <RightSideButton
            {...props.resendButton}
            needMargin={props.dimens.isLargeWidth}
            screenWidth={props.dimens.width}
        >
            {Message.get(MessageKeys.confirm_email_resend_button)}
        </RightSideButton>
    );

    const handleChangeEmail = () => {
        let newEmail = "";
        let password = "";
        Alert.alert(Message.get(MessageKeys.confirm_email_change_email_button), "", [
            {
                text: Message.get(MessageKeys.cancel),
                style: "cancel",
            },
            {
                text: "OK",
                onPress: () => props.onChangeEmailPress(newEmail, password),
            },
        ]);
        // React Native Alert doesn't support text fields natively on all platforms;
        // on iOS it does. For a cross-platform approach, we rely on platform Alert.prompt.
        Alert.prompt?.(
            Message.get(MessageKeys.confirm_email_change_email_button),
            "",
            [
                { text: Message.get(MessageKeys.cancel), style: "cancel" },
                {
                    text: "OK",
                    onPress: (value: string | undefined) => {
                        newEmail = value ?? "";
                        Alert.prompt?.(
                            "Current Password",
                            "",
                            [
                                {
                                    text: Message.get(MessageKeys.cancel),
                                    style: "cancel",
                                },
                                {
                                    text: "OK",
                                    onPress: (pw: string | undefined) => {
                                        password = pw ?? "";
                                        props.onChangeEmailPress(newEmail, password);
                                    },
                                },
                            ],
                            "secure-text",
                        );
                    },
                },
            ],
            "plain-text",
        );
    };

    const bottomButtons =
        props.dimens.isDesktop || props.dimens.isSmallHeight ? (
            <View style={{ flexDirection: "row" }}>
                {checkButton}
                {resendButton}
            </View>
        ) : (
            <View>
                {checkButton}
                {resendButton}
            </View>
        );

    return (
        <InternalView>
            <ConvertibleContentTitle isDesktop={props.dimens.isDesktop}>
                {Message.get(MessageKeys.confirm_email_title)}
            </ConvertibleContentTitle>
            <FlexSpacer />
            <ContentText>{Message.get(MessageKeys.confirm_email_text)}</ContentText>
            {props.email ? (
                <ContentText style={{ color: Colors.cyan }}>{props.email}</ContentText>
            ) : null}
            <FlexSpacer />
            {props.errorText ? <ErrorText>{props.errorText}</ErrorText> : null}
            {props.successMessage ? (
                <ContentText style={{ color: Colors.cyan }}>{props.successMessage}</ContentText>
            ) : null}
            {bottomButtons}
            <Button onPress={handleChangeEmail} screenWidth={props.dimens.width}>
                {Message.get(MessageKeys.confirm_email_change_email_button)}
            </Button>
        </InternalView>
    );
};
//#endregion
