//#region Import Modules
import React, { FunctionComponent } from "react";

import { Message, MessageKeys } from "../constants";
import { useSleeping } from "../hooks/useSleeping";
import { SleepingScreenTemplate } from "./templates/SleepingScreenTemplate";
//#endregion

//#region Component
export const SleepingScreen: FunctionComponent = () => {
    const sleepingHook = useSleeping();
    return (
        <SleepingScreenTemplate
            contentTitle={{
                children: Message.get(MessageKeys.sleeping_title),
            }}
            contentText={{
                children: Message.get(sleepingHook.wakeLockTextKey),
                onPress: sleepingHook.contentTextPress,
            }}
            timeView={{
                hours: sleepingHook.settings.alarmHour,
                minutes: sleepingHook.settings.alarmMinute,
            }}
            wakeupButton={{
                onPress: sleepingHook.wakeupButtonPress,
                children: Message.get(MessageKeys.sleeping_wakeup_button),
            }}
        ></SleepingScreenTemplate>
    );
};
//#endregion
