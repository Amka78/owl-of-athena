//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import { Colors, Dimens, Message, MessageKeys } from "../../constants";
import { useLocale } from "../../hooks";
import { Dimensions } from "../../hooks/useWindowDimensions";
import { ErrorText, LeftSideButton } from "../atoms";
import {
    ConvertibleContentTitle,
    InternalView,
    LabeledCheckBox,
    RightSideButton,
    ValidatableTextBox,
} from "../molecules";
import {
    TemplateLabeledCheckBoxProps,
    TemplateValidateTextBoxProps,
} from "./TempatedProps";
//#endregion

//#region Types
export type SignupScreenTemplateProps = {
    emailTextBox: TemplateValidateTextBoxProps;
    passwordTextBox: TemplateValidateTextBoxProps;
    passwordConfirmTextBox: TemplateValidateTextBoxProps;
    labeledCheckBox: TemplateLabeledCheckBoxProps;
    errorText?: string;
    onSignupPress: () => void;
    onCancelPress: () => void;
    dimens: Dimensions;
    locale?: string;
};
//#endregion

//#region Component
export const SignupScreenTemplate: FunctionComponent<SignupScreenTemplateProps> = (
    props: SignupScreenTemplateProps
) => {
    useLocale(props.locale);

    const signupButton = (
        <LeftSideButton
            onPress={props.onSignupPress}
            screenWidth={props.dimens.width}
            needMargin={props.dimens.isLargeWidth}
        >
            {Message.get(MessageKeys.signup_button)}
        </LeftSideButton>
    );
    const cancelButton = (
        <RightSideButton
            onPress={props.onCancelPress}
            screenWidth={props.dimens.width}
            needMargin={props.dimens.isLargeWidth}
        >
            {Message.get(MessageKeys.cancel)}
        </RightSideButton>
    );

    let bottomButtons;
    if (props.dimens.isDesktop || props.dimens.isSmallHeight) {
        bottomButtons = (
            <View style={{ flexDirection: "row" }}>
                {signupButton}
                {cancelButton}
            </View>
        );
    } else {
        bottomButtons = signupButton;
    }

    const textBoxMarginBottom = props.dimens.isSmallHeight
        ? 0
        : Dimens.button_margin;
    const textBoxHeight = props.dimens.isSmallHeight ? 45 : undefined;
    return (
        <InternalView>
            <ConvertibleContentTitle isDesktop={props.dimens.isDesktop}>
                {Message.get(MessageKeys.signup_title)}
            </ConvertibleContentTitle>
            <ValidatableTextBox
                {...props.emailTextBox}
                helperText={props.errorText}
                keyboardType={"email-address"}
                label={Message.get(MessageKeys.signup_input_email)}
                style={{
                    height: textBoxHeight,
                    marginBottom: textBoxMarginBottom,
                }}
            ></ValidatableTextBox>
            <ValidatableTextBox
                {...props.passwordTextBox}
                helperText={props.errorText}
                keyboardType={"email-address"}
                secureTextEntry={true}
                label={Message.get(MessageKeys.signup_input_password)}
                style={{
                    height: textBoxHeight,
                    marginBottom: textBoxMarginBottom,
                }}
            ></ValidatableTextBox>
            <ValidatableTextBox
                {...props.passwordConfirmTextBox}
                helperText={props.errorText}
                keyboardType={"email-address"}
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
                    flex: props.dimens.isVertical ? 0.5 : 0.8,
                }}
                label={Message.get(MessageKeys.signup_terms)}
                labelPlace={"right"}
                labelStyle={{ color: Colors.cyan }}
                textContainerStyle={{
                    flex: props.dimens.isVertical ? 1.5 : 1.2,
                }}
            ></LabeledCheckBox>

            <ErrorText>{props.errorText}</ErrorText>
            {bottomButtons}
        </InternalView>
    );
};
//#endregion
