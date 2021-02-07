//#region Import Modules
import React, { FunctionComponent } from "react";

import { useWaking } from "../../hooks/useWaking ";
import { WakingScreenTemplate } from "./../templates/WakingScreenTemplate";
//#endregion

//#region Components
export const WakingScreen: FunctionComponent = () => {
    const wakingHook = useWaking();
    return (
        <WakingScreenTemplate
            timeView={{
                hours: wakingHook.settings.alarmHour,
                minutes: wakingHook.settings.alarmMinute,
            }}
            wakeupButton={{
                onPress: wakingHook.wakeupButtonPress,
            }}
        ></WakingScreenTemplate>
    );
};
//#endregion
