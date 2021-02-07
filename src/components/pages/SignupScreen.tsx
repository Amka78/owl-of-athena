//#region Import Modules
import React, { FunctionComponent } from "react";

import { useSignup } from "../../hooks";
import { SignupScreenTemplate } from "./../templates/SignupScreenTemplate";
//#endregion

//#region Component
export const SignupScreen: FunctionComponent = () => {
    const signupHooks = useSignup(false);
    return (
        <SignupScreenTemplate
            emailTextBox={{
                ...signupHooks.emailHooks,
                helperText: signupHooks.emailError,
            }}
            passwordTextBox={{
                ...signupHooks.passwordHooks,
                helperText: signupHooks.passwordError,
            }}
            passwordConfirmTextBox={{
                ...signupHooks.passwordConfirmHooks,
                helperText: signupHooks.passwordConfirmError,
            }}
            labeledCheckBox={{
                ...signupHooks.checkBoxHooks,
                onLabelPress: signupHooks.onLinkTextPress,
            }}
            errorText={{ children: signupHooks.generalError }}
            signupButton={{
                onPress: signupHooks.onSignupPress,
            }}
        ></SignupScreenTemplate>
    );
};
//#endregion
