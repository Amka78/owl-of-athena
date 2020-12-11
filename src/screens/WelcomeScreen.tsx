//#region Import Modules
import React, { FunctionComponent } from "react";

import { useWelcome } from "../hooks/useWelcome";
import { MessageKeys } from "../constants";
import { WelcomeScreenTemplate } from "./template/WelcomeScreenTemplate";
//#endregion

//#region Constraint
const WelcomScreenMessages = {
    contentTitle: { key: MessageKeys.welcome_title },
    contentText: { key: MessageKeys.welcome_text },
    standaloneButton: { key: MessageKeys.welcome_standalone_button },
    loginButton: { key: MessageKeys.welcome_login_button },
    signupButton: { key: MessageKeys.welcome_signup_button },
};
//#endregion

//#region Component
export const WelcomeScreen: FunctionComponent = () => {
    const useWelcomeHook = useWelcome();
    return (
        <WelcomeScreenTemplate
            contentTitleText={WelcomScreenMessages.contentTitle}
            contentText={WelcomScreenMessages.contentText}
            standaloneButtonText={WelcomScreenMessages.standaloneButton}
            standaloneButtonPress={useWelcomeHook.onStandalonePress}
            loginButtonText={WelcomScreenMessages.loginButton}
            loginButtonPress={useWelcomeHook.onLoginPress}
            signupButtonText={WelcomScreenMessages.signupButton}
            signupButtonPress={useWelcomeHook.onSignupPress}
        ></WelcomeScreenTemplate>
    );
};
//#endregion
