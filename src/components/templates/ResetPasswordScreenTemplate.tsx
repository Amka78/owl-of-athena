//#region Import Modules
import React, { type FunctionComponent } from "react";
import { View } from "react-native";

import { Colors, Message, MessageKeys } from "../../constants";
import { useConvertibleHeader } from "../../hooks/useConvertibleHeader";
import { useLocale } from "../../hooks/useLocale";
import type { useTextBoxReturn } from "../../hooks/useTextBox";
import type { Dimensions } from "../../hooks/useWindowDimensions";
import { ContentText } from "../atoms/ContentText";
import { ErrorText, type ErrorTextProps } from "../atoms/ErrorText";
import { FlexSpacer } from "../atoms/FlexSpacer";
import { LeftSideButton } from "../atoms/LeftSideButton";
import { TextBox } from "../atoms/TextBox";
import { ConvertibleContentTitle } from "../molecules/ConvertibleContentTitle";
import { InternalView } from "../molecules/InternalView";
import { RightSideButton } from "../molecules/RightSideButton";
import type { TemplateButtonProps } from "./TempatedProps";
//#endregion

//#region Types
export type ResetPasswordScreenTemplateProps = {
    state: "checking" | "ready" | "invalid" | "success";
    newPassword: useTextBoxReturn;
    confirmPassword: useTextBoxReturn;
    errorText: ErrorTextProps;
    saveButton: TemplateButtonProps;
    loginButton: TemplateButtonProps;
    requestButton: TemplateButtonProps;
    dimens: Dimensions;
    locale?: string;
};
//#endregion

//#region Component
export const ResetPasswordScreenTemplate: FunctionComponent<ResetPasswordScreenTemplateProps> = (
    props: ResetPasswordScreenTemplateProps,
) => {
    useLocale(props.locale);
    useConvertibleHeader(
        MessageKeys.reset_password_title,
        props.dimens.isDesktop,
        props.dimens.isSmallHeight,
    );

    const requestButton = (
        <LeftSideButton
            {...props.requestButton}
            needMargin={props.dimens.isLargeWidth}
            screenWidth={props.dimens.width}
        >
            {Message.get(MessageKeys.reset_password_request_link)}
        </LeftSideButton>
    );

    const loginButton = (
        <RightSideButton
            {...props.loginButton}
            needMargin={props.dimens.isLargeWidth}
            screenWidth={props.dimens.width}
        >
            {Message.get(MessageKeys.reset_password_login)}
        </RightSideButton>
    );

    return (
        <InternalView>
            <ConvertibleContentTitle isDesktop={props.dimens.isDesktop}>
                {Message.get(MessageKeys.reset_password_title)}
            </ConvertibleContentTitle>
            <FlexSpacer />

            {props.state === "checking" && (
                <ContentText>{Message.get(MessageKeys.reset_password_checking)}</ContentText>
            )}

            {props.state === "invalid" && (
                <View>
                    <ContentText style={{ color: Colors.yellow }}>
                        {Message.get(MessageKeys.reset_password_invalid_link)}
                    </ContentText>
                    <ErrorText {...props.errorText} />
                    {requestButton}
                </View>
            )}

            {props.state === "ready" && (
                <View>
                    <ContentText style={{ color: Colors.yellow }}>
                        {Message.get(MessageKeys.change_password_warning)}
                    </ContentText>
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
                    <LeftSideButton
                        {...props.saveButton}
                        needMargin={props.dimens.isLargeWidth}
                        screenWidth={props.dimens.width}
                    >
                        {Message.get(MessageKeys.change_password_button)}
                    </LeftSideButton>
                    {loginButton}
                </View>
            )}

            {props.state === "success" && (
                <View>
                    <ContentText style={{ color: Colors.cyan }}>
                        {Message.get(MessageKeys.reset_password_success)}
                    </ContentText>
                    {loginButton}
                </View>
            )}
        </InternalView>
    );
};
//#endregion