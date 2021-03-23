//#region Import Modules
import React, { FunctionComponent } from "react";
import { useWindowDimensions } from "../../hooks";

import { useWelcome } from "../../hooks/useWelcome";
import { WelcomeScreenTemplate } from "./../templates/WelcomeScreenTemplate";
//#endregion

//#region Component
export const WelcomeScreen: FunctionComponent = () => {
    const useWelcomeHook = useWelcome();
    const dimens = useWindowDimensions();
    return (
        <WelcomeScreenTemplate
            onStandalonePress={useWelcomeHook.onStandalonePress}
            onLoginPress={useWelcomeHook.onLoginPress}
            onSignupPress={useWelcomeHook.onSignupPress}
            dimens={dimens}
        ></WelcomeScreenTemplate>
    );
};
//#endregion
