//#region Import Modules
import React, { FunctionComponent } from "react";

import { Message, MessageKeys } from "../constants";
import { useForgotPassword } from "../hooks";
import { ForgotPasswordScreenTemplate } from "./templates/ForgotPasswordScreenTemplate";
//#endregion

//#region Component
export const ForgotPasswordScreen: FunctionComponent = () => {
    const forgotPassword = useForgotPassword(false);
    return (
        <ForgotPasswordScreenTemplate
            contentTitle={{
                children: Message.get(MessageKeys.forgot_password_title),
            }}
            contentText={{
                children: Message.get(MessageKeys.forgot_password_text),
            }}
            emailAddress={{
                ...forgotPassword.emailAddress,
            }}
            errorText={{
                children: Message.get(forgotPassword.generalError),
            }}
            forgotPasswordButton={{
                children: Message.get(MessageKeys.forgot_password_button),
                onPress: forgotPassword.onForgotPasswordPress,
            }}
        ></ForgotPasswordScreenTemplate>
    );
};
//#endregion
