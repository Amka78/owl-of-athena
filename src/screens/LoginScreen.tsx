//#region Import Modules
import React, { FunctionComponent } from "react";

import { Message, MessageKeys } from "../constants";
import { useLogin } from "../hooks";
import { LoginScreenTemplate } from "./templates/LoginScreenTexplate";
//#endregion

//#region Component
export const LoginScreen: FunctionComponent = () => {
    const loginHook = useLogin();

    return (
        <LoginScreenTemplate
            contentTitle={{ children: Message.get(MessageKeys.login_title) }}
            email={{
                ...loginHook.email,
                label: Message.get(MessageKeys.login_input_email),
            }}
            password={{
                ...loginHook.password,
                label: Message.get(MessageKeys.login_input_password),
            }}
            errorText={{
                children: Message.get(loginHook.generalError),
            }}
            loginButton={{
                children: Message.get(MessageKeys.login_button),
                onPress: loginHook.onLoginPress,
            }}
            forgotPasswordButton={{
                children: Message.get(MessageKeys.login_forgot_password_button),
                onPress: loginHook.onForgotPasswordButtonPress,
            }}
            signupButton={{
                children: Message.get(MessageKeys.login_no_account_button),
                onPress: loginHook.onSignupButtonPress,
            }}
        ></LoginScreenTemplate>
    );
};
//#endregion
