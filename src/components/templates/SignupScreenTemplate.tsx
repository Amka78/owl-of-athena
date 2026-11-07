//#region Import Modules
import type { FunctionComponent, ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { RadioButton } from "react-native-paper";

import { Colors, Dimens, Message, MessageKeys } from "../../constants";
import { useLocale } from "../../hooks";
import type { Dimensions } from "../../hooks/useWindowDimensions";
import { ErrorText, LeftSideButton, TextBox } from "../atoms";
import {
    ConvertibleContentTitle,
    DatePicker,
    type DatePickerProps,
    InternalView,
    LabeledCheckBox,
    LabeledRadioButton,
    RightSideButton,
    ValidatableTextBox,
} from "../molecules";
import type {
    TemplateLabeledCheckBoxProps,
    TemplateRadioButtonProps,
    TemplateTextBoxProps,
    TemplateValidateTextBoxProps,
} from "./TempatedProps";
//#endregion

//#region Types
export type SignupScreenTemplateProps = {
    firstNameTextBox: TemplateTextBoxProps;
    lastNameTextBox: TemplateTextBoxProps;
    emailTextBox: TemplateValidateTextBoxProps;
    passwordTextBox: TemplateValidateTextBoxProps;
    passwordConfirmTextBox: TemplateValidateTextBoxProps;
    birthDay: DatePickerProps;
    gender: {
        value: string;
        onValueChange: (value: string) => void;
    };
    maleRadioButton: TemplateRadioButtonProps;
    femaleRadioButton: TemplateRadioButtonProps;
    newsletterCheckBox: TemplateLabeledCheckBoxProps;
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
    props: SignupScreenTemplateProps,
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

    let bottomButtons: ReactNode;
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

    const textBoxMarginBottom = props.dimens.isSmallHeight ? 0 : Dimens.button_margin;
    const textBoxHeight = props.dimens.isSmallHeight ? 45 : undefined;
    const splitWidth = props.dimens.isHorizontal ? Dimens.input_text_max_width / 2 : undefined;
    const itemMargin = props.dimens.isHorizontal ? Dimens.items_margin : undefined;
    return (
        <InternalView>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <ConvertibleContentTitle isDesktop={props.dimens.isDesktop}>
                    {Message.get(MessageKeys.signup_title)}
                </ConvertibleContentTitle>
                <View
                    style={{
                        flexDirection: props.dimens.isHorizontal ? "row" : "column",
                        width: "100%",
                    }}
                >
                    <TextBox
                        {...props.firstNameTextBox}
                        label={Message.get(MessageKeys.account_input_first_name)}
                        style={{ marginRight: itemMargin }}
                        maxWidth={splitWidth}
                    ></TextBox>
                    <TextBox
                        {...props.lastNameTextBox}
                        label={Message.get(MessageKeys.account_input_last_name)}
                        style={{ marginLeft: itemMargin }}
                        maxWidth={splitWidth}
                    ></TextBox>
                </View>
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
                <View
                    style={{
                        flexDirection: props.dimens.isHorizontal ? "row" : "column",
                        width: "100%",
                    }}
                >
                    <DatePicker
                        {...props.birthDay}
                        format={Message.get(MessageKeys.date_format)}
                        label={Message.get(MessageKeys.account_input_birthday)}
                        style={{ marginRight: itemMargin }}
                        maxWidth={splitWidth}
                    ></DatePicker>
                    <View
                        style={{
                            alignItems: "center",
                            width: splitWidth,
                            marginLeft: itemMargin,
                            maxWidth: splitWidth,
                        }}
                    >
                        <RadioButton.Group {...props.gender}>
                            <LabeledRadioButton
                                {...props.maleRadioButton}
                                label={Message.get(MessageKeys.male)}
                            ></LabeledRadioButton>
                            <LabeledRadioButton
                                {...props.femaleRadioButton}
                                label={Message.get(MessageKeys.female)}
                            ></LabeledRadioButton>
                        </RadioButton.Group>
                    </View>
                </View>
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
                <LabeledCheckBox
                    {...props.newsletterCheckBox}
                    checkBoxStyle={{
                        flex: props.dimens.isVertical ? 0.5 : 0.8,
                    }}
                    label={Message.get(MessageKeys.signup_newsletter)}
                    labelPlace={"right"}
                    labelStyle={{ color: Colors.cyan }}
                    textContainerStyle={{
                        flex: props.dimens.isVertical ? 1.5 : 1.2,
                    }}
                ></LabeledCheckBox>

                <ErrorText>{props.errorText}</ErrorText>
                {bottomButtons}
            </ScrollView>
        </InternalView>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    scroll: { width: "100%" },
    scrollContent: { alignItems: "center", width: "100%" },
});
//#endregion
