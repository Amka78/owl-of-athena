//#region Import Modules
import React, { FunctionComponent } from "react";

import { useLogin } from "../../hooks";
import { LoginScreenTemplate } from "../templates/LoginScreenTemplate";
//#endregion

//#region Component
export const LoginScreen: FunctionComponent = () => {
    const loginHook = useLogin();

    return (
        <LoginScreenTemplate
            email={{
                ...loginHook.email,
            }}
            password={{
                ...loginHook.password,
            }}
            errorText={{
                children: loginHook.generalError,
            }}
            loginButton={{
                onPress: loginHook.onLoginPress,
            }}
            forgotPasswordButton={{
                onPress: loginHook.onForgotPasswordButtonPress,
            }}
            signupButton={{
                onPress: loginHook.onSignupButtonPress,
            }}
        ></LoginScreenTemplate>
    );
};
//#endregion
