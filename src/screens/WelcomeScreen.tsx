//#region Import Modules
import React, { FunctionComponent } from "react";

import { Message, MessageKeys } from "../constants";
import { useWelcome } from "../hooks/useWelcome";
import { WelcomeScreenTemplate } from "./templates/WelcomeScreenTemplate";
//#endregion

//#region Component
export const WelcomeScreen: FunctionComponent = () => {
    const useWelcomeHook = useWelcome();
    return (
        <WelcomeScreenTemplate
            contentTitle={{
                children: Message.get(MessageKeys.welcome_title),
            }}
            contentText={{
                children: Message.get(MessageKeys.welcome_text),
            }}
            standaloneButton={{
                children: Message.get(MessageKeys.welcome_standalone_button),
                onPress: useWelcomeHook.onStandalonePress,
            }}
            loginButton={{
                children: Message.get(MessageKeys.welcome_login_button),
                onPress: useWelcomeHook.onLoginPress,
            }}
            signupButton={{
                children: Message.get(MessageKeys.welcome_signup_button),
                onPress: useWelcomeHook.onSignupPress,
            }}
        ></WelcomeScreenTemplate>
    );
};
//#endregion
