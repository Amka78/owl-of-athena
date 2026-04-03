//#region Import Modules
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { setWakeLock } from "../actions";
import { MessageKeys } from "../constants";
import { useCheckLogging } from "../hooks";
import { useWakeLockSelector } from "../hooks/useWakeLockSelector";
import { WakeLockService } from "../services";
import { useSettingsSelector } from "./useSettingsSelector";
import { Settings } from "../sdk/models";
import { AuroraManagerInstance } from "../managers";
import { SleepStates } from "../sdk";
//#endregion

//#region Hooks
export const useSleeping = (): {
    wakeLockTextKey: string;
    onRelockPress: () => void;
    onWakeupPress: () => void;
    settings: Settings;
} => {
    useCheckLogging();

    const dispatch = useDispatch();
    const wakeLock = useWakeLockSelector();
    const settings = useSettingsSelector();
    console.debug(`current Wakelock:${wakeLock}`);

    const wakeLockTextKey = wakeLock
        ? MessageKeys.sleeping_wakelock
        : MessageKeys.sleeping_wakeunlock;

    const contentTextPress = useCallback((): void => {
        if (!wakeLock) {
            WakeLockService.request(
                () => {
                    dispatch(setWakeLock(true));
                },
                () => {
                    dispatch(setWakeLock(false));
                    WakeLockService.release();
                }
            );
        }
    }, [dispatch, wakeLock]);

    const wakeupButtonPress = useCallback((): void => {
        AuroraManagerInstance.setSleepState(SleepStates.AWAKE);
    }, []);
    return {
        wakeLockTextKey,
        onRelockPress: contentTextPress,
        onWakeupPress: wakeupButtonPress,
        settings,
    };
};
//#endregion
