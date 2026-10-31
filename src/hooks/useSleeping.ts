//#region Import Modules
import { useCallback } from "react";
import { MessageKeys } from "../constants";
import { useCheckLogging } from "../hooks";
import { useAlarmState } from "../hooks/useAlarm";
import { useWakeLockSelector } from "../hooks/useWakeLockSelector";
import { AlarmRuntimeInstance } from "../managers";
import { isAlarmSnoozing } from "../managers/alarm/AlarmScheduler";
import type { Settings } from "../sdk/models";
import { WakeLockService } from "../services";
import { useAppStore } from "../store/appStore";
import { useSettingsSelector } from "./useSettingsSelector";

//#endregion

//#region Hooks
export const useSleeping = (): {
    wakeLockTextKey: string;
    onRelockPress: () => void;
    onWakeupPress: () => void;
    isSnoozing: boolean;
    settings: Settings;
} => {
    useCheckLogging();

    const { setWakeLock } = useAppStore();
    const wakeLock = useWakeLockSelector();
    const settings = useSettingsSelector();
    const alarmState = useAlarmState();
    console.debug(`current Wakelock:${wakeLock}`);

    const wakeLockTextKey = wakeLock
        ? MessageKeys.sleeping_wakelock
        : MessageKeys.sleeping_wakeunlock;

    const contentTextPress = useCallback((): void => {
        if (!wakeLock) {
            WakeLockService.request(
                () => {
                    setWakeLock(true);
                },
                () => {
                    setWakeLock(false);
                    WakeLockService.release();
                },
            );
        }
    }, [setWakeLock, wakeLock]);

    const wakeupButtonPress = useCallback((): void => {
        void AlarmRuntimeInstance.dismiss();
    }, []);

    return {
        wakeLockTextKey,
        onRelockPress: contentTextPress,
        onWakeupPress: wakeupButtonPress,
        isSnoozing: isAlarmSnoozing(alarmState),
        settings,
    };
};
//#endregion
