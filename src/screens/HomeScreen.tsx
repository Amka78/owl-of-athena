//#region Import Modules
import React, { FunctionComponent } from "react";

import { Message, MessageKeys } from "../constants";
import { useHome } from "../hooks/useHome";
import { HomeScreenTemplate } from "./templates/HomeScreenTemplate";
//#endregion

//#region Component
export const HomeScreen: FunctionComponent = () => {
    const homeHook = useHome();
    return (
        <HomeScreenTemplate
            timeViewField={{
                onPress: homeHook.timeViewPress,
            }}
            timeView={{
                hours: homeHook.settings.alarmHour,
                minutes: homeHook.settings.alarmMinute,
            }}
            timeViewButton={{
                children: Message.get(MessageKeys.home_edit_alarm_button),
            }}
            profileButton={{
                children: Message.get(MessageKeys.home_default_profile),
                onPress: homeHook.timeViewPress,
            }}
            errorText={{
                children: Message.get(homeHook.errorText),
            }}
            goToSleepButton={{
                children: Message.get(MessageKeys.home_go_to_sleep_button),
                onPress: homeHook.goToSleepPress,
            }}
        ></HomeScreenTemplate>
    );
};
//#endregion
