//#region Import Modules
import React, { FunctionComponent } from "react";

import { Message, MessageKeys } from "../constants";
import { useSignup } from "../hooks";
import { SignupScreenTemplate } from "./templates/SignupScreenTemplate";
//#endregion

//#region Component
export const SignupScreen: FunctionComponent = () => {
    const signupHooks = useSignup(false);
    return (
        <SignupScreenTemplate
            contentTitle={{ children: Message.get(MessageKeys.signup_title) }}
            emailTextBox={{
                ...signupHooks.emailHooks,
                label: Message.get(MessageKeys.signup_input_email),
                helperText: signupHooks.emailError,
            }}
            passwordTextBox={{
                ...signupHooks.passwordHooks,
                label: Message.get(MessageKeys.signup_input_password),
                helperText: signupHooks.passwordError,
            }}
            passwordConfirmTextBox={{
                ...signupHooks.passwordConfirmHooks,
                label: Message.get(MessageKeys.signup_input_password_confirm),
                helperText: signupHooks.passwordConfirmError,
            }}
            labeledCheckBox={{
                ...signupHooks.checkBoxHooks,
                label: Message.get(MessageKeys.signup_terms),
                onLabelPress: signupHooks.onLinkTextPress,
            }}
            errorText={{ children: signupHooks.generalError }}
            signupButton={{
                children: Message.get(MessageKeys.signup_button),
                onPress: signupHooks.onSignupPress,
            }}
        ></SignupScreenTemplate>
    );
};
//#endregion
