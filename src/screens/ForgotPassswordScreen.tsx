import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { CommonStyles } from "../styles";
import {
    Button,
    ContentTitle,
    ErrorText,
    TextBox,
    ContentText
} from "../components";
import { useTextBox, useForgotPassword } from "../hooks";
export const ForgotPasswordScreen: FunctionComponent = () => {
    const emailHooks = useTextBox("");
    const forgotPassword = useForgotPassword(false, emailHooks.value);
    return (
        <View style={CommonStyles.rootContainer}>
            <View style={CommonStyles.standardView}>
                <ContentTitle>{"forgot_password_title"}</ContentTitle>
                <ContentText>{"forgot_password_text"}</ContentText>
                <TextBox
                    {...emailHooks}
                    label={"forgot_password_input_email"}
                    keyboardType={"email-address"}
                ></TextBox>

                <ErrorText>{forgotPassword.generalError}</ErrorText>
                <Button {...forgotPassword}>{"forgot_password_button"}</Button>
            </View>
        </View>
    );
};
