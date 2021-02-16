//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import { Colors, Dimens, Message, MessageKeys } from "../../constants";
import {
    useConvertibleHeader,
    useLocale,
    useWindowDimensions,
} from "../../hooks";
import {
    ContentTitleProps,
    ErrorText,
    ErrorTextProps,
    StandardView,
} from "../atoms";
import {
    ConvertibleContentTitle,
    LabeledCheckBox,
    LabeledCheckBoxProps,
    LeftSideButton,
    RightSideButton,
    ValidatableTextBox,
    ValidatableTextBoxProps,
} from "../molecules";
import { TemplateButtonProps } from "./TempatedProps";
//#endregion

//#region Types
export type SignupScreenTemplateProps = {
    contentTitle?: ContentTitleProps;
    emailTextBox: ValidatableTextBoxProps;
    passwordTextBox: ValidatableTextBoxProps;
    passwordConfirmTextBox: ValidatableTextBoxProps;
    labeledCheckBox: LabeledCheckBoxProps;
    errorText: ErrorTextProps;
    signupButton: TemplateButtonProps;
    cancelButton: TemplateButtonProps;
    locale?: string;
};
//#endregion

//#region Component
export const SignupScreenTemplate: FunctionComponent<SignupScreenTemplateProps> = (
    props: SignupScreenTemplateProps
) => {
    useLocale(props.locale);
    const dimens = useWindowDimensions();
    useConvertibleHeader(
        MessageKeys.signup_title,
        dimens.isDesktop,
        dimens.isSmallHeight
    );

    const signupButton = (
        <LeftSideButton
            {...props.signupButton}
            isLargeWidth={dimens.isLargeWidth}
        >
            {Message.get(MessageKeys.signup_button)}
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
                {signupButton}
                {cancelButton}
            </View>
        );
    } else {
        bottomButtons = signupButton;
    }

    const textBoxMarginBottom = dimens.isSmallHeight
        ? 0
        : Dimens.button_margin_bottom;
    const textBoxHeight = dimens.isSmallHeight ? 45 : undefined;
    return (
        <StandardView
            standardViewStyle={{
                maxWidth: Dimens.inner_screen_max_width,
                maxHeight: Dimens.inner_screen_max_height,
            }}
        >
            <ConvertibleContentTitle isDesktop={dimens.isDesktop}>
                {Message.get(MessageKeys.signup_title)}
            </ConvertibleContentTitle>
            <ValidatableTextBox
                {...props.emailTextBox}
                keyboardType={"email-address"}
                label={Message.get(MessageKeys.signup_input_email)}
                style={{
                    height: textBoxHeight,
                    marginBottom: textBoxMarginBottom,
                }}
            ></ValidatableTextBox>
            <ValidatableTextBox
                {...props.passwordTextBox}
                secureTextEntry={true}
                label={Message.get(MessageKeys.signup_input_password)}
                style={{
                    height: textBoxHeight,
                    marginBottom: textBoxMarginBottom,
                }}
            ></ValidatableTextBox>
            <ValidatableTextBox
                {...props.passwordConfirmTextBox}
                secureTextEntry={true}
                label={Message.get(MessageKeys.signup_input_password_confirm)}
                style={{
                    height: textBoxHeight,
                    marginBottom: textBoxMarginBottom,
                }}
            ></ValidatableTextBox>
            <LabeledCheckBox
                {...props.labeledCheckBox}
                checkBoxStyle={{
                    flex: dimens.height > dimens.width ? 0.5 : 0.8,
                }}
                label={Message.get(MessageKeys.signup_terms)}
                labelPlace={"right"}
                labelStyle={{ color: Colors.cyan }}
                textContainerStyle={{
                    flex: dimens.height > dimens.width ? 1.5 : 1.2,
                }}
            ></LabeledCheckBox>
            <ErrorText {...props.errorText}></ErrorText>
            {bottomButtons}
        </StandardView>
    );
};
//#endregion
