import React, { FunctionComponent } from "react";

import {
    Button,
    ContentText,
    ContentTitle,
    ErrorText,
    StandardView,
    TextBox
} from "../components";
import { useForgotPassword, useTextBox } from "../hooks";

export const ForgotPasswordScreen: FunctionComponent = () => {
    const emailHooks = useTextBox("");
    const forgotPassword = useForgotPassword(false, emailHooks.value);
    return (
        <StandardView>
            <ContentTitle>{"forgot_password_title"}</ContentTitle>
            <ContentText>{"forgot_password_text"}</ContentText>
            <TextBox
                {...emailHooks}
                label={"forgot_password_input_email"}
                keyboardType={"email-address"}
            ></TextBox>

            <ErrorText>{forgotPassword.generalError}</ErrorText>
            <Button {...forgotPassword}>{"forgot_password_button"}</Button>
        </StandardView>
    );
};
