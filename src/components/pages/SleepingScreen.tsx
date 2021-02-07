//#region Import Modules
import React, { FunctionComponent } from "react";

import { useSleeping } from "../../hooks/useSleeping";
import { Message } from "../../constants";
import { SleepingScreenTemplate } from "./../templates/SleepingScreenTemplate";
//#endregion

//#region Component
export const SleepingScreen: FunctionComponent = () => {
    const sleepingHook = useSleeping();
    return (
        <SleepingScreenTemplate
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
            }}
        ></SleepingScreenTemplate>
    );
};
//#endregion
