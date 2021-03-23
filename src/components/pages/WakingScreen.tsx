//#region Import Modules
import React, { FunctionComponent } from "react";
import { useConvertibleHeader, useWindowDimensions } from "../../hooks";

import { useWaking } from "../../hooks/useWaking ";
import { MessageKeys } from "../../constants";
import { WakingScreenTemplate } from "./../templates/WakingScreenTemplate";
//#endregion

//#region Components
export const WakingScreen: FunctionComponent = () => {
    const wakingHook = useWaking();
    const dimens = useWindowDimensions();
    useConvertibleHeader(
        MessageKeys.waking_title,
        dimens.isDesktop,
        dimens.isSmallHeight
    );
    return (
        <WakingScreenTemplate
            dimens={dimens}
            timeView={{
                hours: wakingHook.settings.alarmHour,
                minutes: wakingHook.settings.alarmMinute,
            }}
            onWakeupPress={wakingHook.wakeupButtonPress}
        ></WakingScreenTemplate>
    );
};
//#endregion
