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
import { MessageKeys } from "../constants";
export const ForgotPasswordScreen: FunctionComponent = () => {
    const emailHooks = useTextBox("");
    const forgotPassword = useForgotPassword(false, emailHooks.value);
    return (
        <StandardView>
            <ContentTitle>
                {{ key: MessageKeys.forgot_password_title }}
            </ContentTitle>
            <ContentText>
                {{ key: MessageKeys.forgot_password_text }}
            </ContentText>
            <TextBox
                {...emailHooks}
                label={{ key: MessageKeys.forgot_password_input_email }}
                keyboardType={"email-address"}
            ></TextBox>

            <ErrorText>{{ key: forgotPassword.generalError }}</ErrorText>
            <Button {...forgotPassword}>
                {{ key: MessageKeys.forgot_password_button }}
            </Button>
        </StandardView>
    );
};
