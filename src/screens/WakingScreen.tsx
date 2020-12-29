//#region Import Modules
import React, { FunctionComponent } from "react";

import { Message, MessageKeys } from "../constants";
import { useWaking } from "../hooks/useWaking ";
import { WakingScreenTemplate } from "./templates/WakingScreenTemplate";
//#endregion

//#region Components
export const WakingScreen: FunctionComponent = () => {
    const wakingHook = useWaking();
    return (
        <WakingScreenTemplate
            contentTitle={{
                children: Message.get(MessageKeys.waking_title),
            }}
            timeView={{
                hours: wakingHook.settings.alarmHour,
                minutes: wakingHook.settings.alarmMinute,
            }}
            wakeupButton={{
                onPress: wakingHook.wakeupButtonPress,
                children: Message.get(MessageKeys.waking_wakeup_button),
            }}
            contentText={{
                children: Message.get(MessageKeys.waking_tip_text),
            }}
        ></WakingScreenTemplate>
    );
};
//#endregion
