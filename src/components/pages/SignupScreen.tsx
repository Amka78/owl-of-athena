//#region Import Modules
import React, { FunctionComponent } from "react";

import { MessageKeys } from "../../constants";
import {
    useConvertibleHeader,
    useSignup,
    useWindowDimensions,
} from "../../hooks";
import { SignupScreenTemplate } from "./../templates/SignupScreenTemplate";
//#endregion

//#region Component
export const SignupScreen: FunctionComponent = () => {
    const signupHooks = useSignup(false);
    const dimens = useWindowDimensions();
    useConvertibleHeader(
        MessageKeys.signup_title,
        dimens.isDesktop,
        dimens.isSmallHeight
    );
    return (
        <SignupScreenTemplate
            dimens={dimens}
            emailTextBox={{
                ...signupHooks.emailHooks,
                errorText: signupHooks.emailError,
            }}
            passwordTextBox={{
                ...signupHooks.passwordHooks,
                errorText: signupHooks.passwordError,
            }}
            passwordConfirmTextBox={{
                ...signupHooks.passwordConfirmHooks,
                errorText: signupHooks.passwordConfirmError,
            }}
            labeledCheckBox={{
                ...signupHooks.checkBoxHooks,
                onLabelPress: signupHooks.onLinkTextPress,
            }}
            errorText={signupHooks.generalError}
            onSignupPress={signupHooks.onSignupPress}
            onCancelPress={signupHooks.onCancelPress}
        ></SignupScreenTemplate>
    );
};
//#endregion
