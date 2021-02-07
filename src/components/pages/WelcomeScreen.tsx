//#region Import Modules
import React, { FunctionComponent } from "react";

import { useWelcome } from "../../hooks/useWelcome";
import { WelcomeScreenTemplate } from "./../templates/WelcomeScreenTemplate";
//#endregion

//#region Component
export const WelcomeScreen: FunctionComponent = () => {
    const useWelcomeHook = useWelcome();
    return (
        <WelcomeScreenTemplate
            standaloneButton={{
                onPress: useWelcomeHook.onStandalonePress,
            }}
            loginButton={{
                onPress: useWelcomeHook.onLoginPress,
            }}
            signupButton={{
                onPress: useWelcomeHook.onSignupPress,
            }}
        ></WelcomeScreenTemplate>
    );
};
//#endregion
