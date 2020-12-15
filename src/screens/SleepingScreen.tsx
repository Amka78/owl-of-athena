//#region Import Modules
import React, { FunctionComponent } from "react";
import {
    Button,
    StandardView,
    ContentTitle,
    TimeView,
    ContentText,
} from "../components";
import { useCheckLogging, useSettingsSelector } from "../hooks";
import { MessageKeys } from "../constants";
import { AuroraManagerInstance } from "../managers";
import { SleepStates } from "../sdk";
import { useWakeLockSelector } from "../hooks/useWakeLockSelector";
import { WakeLockService } from "../service";
import { useDispatch } from "react-redux";
import { setWakeLock } from "../actions";
import { WakeLockSentinel } from "../types";
//#endregion

//#region Component
export const SleepingScreen: FunctionComponent = () => {
    useCheckLogging();

    const dispatch = useDispatch();
    const setting = useSettingsSelector();
    const wakeLock = useWakeLockSelector();
    console.debug(`current Wakelock:${wakeLock}`);

    const currentKey = wakeLock
        ? MessageKeys.sleeping_wakelock
        : MessageKeys.sleeping_wakeunlock;

    return (
        <StandardView>
            <ContentTitle>{{ key: MessageKeys.sleeping_title }}</ContentTitle>
            <ContentText
                onPress={() => {
                    if (!wakeLock) {
                        WakeLockService.requestWakeLock(
                            (currentWakeLock: WakeLockSentinel) => {
                                dispatch(setWakeLock(currentWakeLock));
                            },
                            () => {
                                dispatch(setWakeLock(undefined));
                            }
                        );
                    }
                }}
            >
                {{
                    key: currentKey,
                }}
            </ContentText>
            <TimeView
                hours={setting.alarmHour}
                minutes={setting.alarmMinute}
                mode={"meridian"}
            ></TimeView>
            <Button
                onPress={(): void => {
                    AuroraManagerInstance.setSleepState(SleepStates.AWAKE);
                }}
            >
                {{ key: MessageKeys.sleeping_wakeup_button }}
            </Button>
        </StandardView>
    );
};
//#endregion
