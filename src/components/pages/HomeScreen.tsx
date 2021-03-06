//#region Import Modules
import React, { FunctionComponent } from "react";
import { useWindowDimensions } from "../../hooks";

import { useHome } from "../../hooks/useHome";
import { HomeScreenTemplate } from "./../templates/HomeScreenTemplate";
//#endregion

//#region Component
export const HomeScreen: FunctionComponent = () => {
    const homeHook = useHome();
    const dimens = useWindowDimensions();
    return (
        <HomeScreenTemplate
            timeViewField={{
                onPress: homeHook.timeViewPress,
            }}
            timeView={{
                hours: homeHook.settings.alarmHour,
                minutes: homeHook.settings.alarmMinute,
            }}
            profileButton={{
                onPress: homeHook.timeViewPress,
            }}
            errorText={{
                children: homeHook.errorText,
            }}
            goToSleepButton={{
                onPress: homeHook.goToSleepPress,
            }}
            dimens={dimens}
        ></HomeScreenTemplate>
    );
};
//#endregion
