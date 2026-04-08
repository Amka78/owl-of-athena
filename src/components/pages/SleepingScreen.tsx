//#region Import Modules
import React, { type FunctionComponent } from "react";
import { Message, MessageKeys } from "../../constants";
import { useConvertibleHeader, useWindowDimensions } from "../../hooks";
import { useSleeping } from "../../hooks/useSleeping";
import { SleepingScreenTemplate } from "./../templates/SleepingScreenTemplate";
//#endregion

//#region Component
export const SleepingScreen: FunctionComponent = () => {
    const sleepingHook = useSleeping();
    const dimens = useWindowDimensions();
    useConvertibleHeader(MessageKeys.sleeping_title, dimens.isDesktop, dimens.isSmallHeight);
    return (
        <SleepingScreenTemplate
            dimens={dimens}
            wakeLockMessage={Message.get(sleepingHook.wakeLockTextKey)}
            onRelockPress={sleepingHook.onRelockPress}
            timeView={{
                hours: sleepingHook.settings.alarmHour,
                minutes: sleepingHook.settings.alarmMinute,
            }}
            onWakeupPress={sleepingHook.onWakeupPress}
            onSnoozePress={sleepingHook.onSnoozePress}
            isSnoozing={sleepingHook.isSnoozing}
        ></SleepingScreenTemplate>
    );
};
//#endregion
