//#region Import Modules
import React, { FunctionComponent } from "react";

import { useConvertibleHeader, useWindowDimensions } from "../../hooks";
import { useSleeping } from "../../hooks/useSleeping";
import { Message, MessageKeys } from "../../constants";
import { SleepingScreenTemplate } from "./../templates/SleepingScreenTemplate";
//#endregion

//#region Component
export const SleepingScreen: FunctionComponent = () => {
    const sleepingHook = useSleeping();
    const dimens = useWindowDimensions();
    useConvertibleHeader(
        MessageKeys.sleeping_title,
        dimens.isDesktop,
        dimens.isSmallHeight
    );
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
        ></SleepingScreenTemplate>
    );
};
//#endregion
