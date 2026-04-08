//#region Import Modules
import { useCallback, useRef, useState } from "react";
import { MessageKeys } from "../constants";
import { useCheckLogging } from "../hooks";
import { useWakeLockSelector } from "../hooks/useWakeLockSelector";
import { AuroraManagerInstance } from "../managers";
import { SleepStates } from "../sdk";
import type { Settings } from "../sdk/models";
import { WakeLockService } from "../services";
import { useAppStore } from "../store/appStore";
import { useSettingsSelector } from "./useSettingsSelector";

//#endregion

const SNOOZE_DURATION_MS = __DEV__ ? 9_000 : 9 * 60_000;

//#region Hooks
export const useSleeping = (): {
    wakeLockTextKey: string;
    onRelockPress: () => void;
    onWakeupPress: () => void;
    onSnoozePress: () => void;
    isSnoozing: boolean;
    settings: Settings;
} => {
    useCheckLogging();

    const { setWakeLock } = useAppStore();
    const wakeLock = useWakeLockSelector();
    const settings = useSettingsSelector();
    const [isSnoozing, setIsSnoozing] = useState(false);
    const snoozeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
        if (snoozeTimer.current) {
            clearTimeout(snoozeTimer.current);
            snoozeTimer.current = null;
        }
        setIsSnoozing(false);
        AuroraManagerInstance.setSleepState(SleepStates.AWAKE);
    }, []);

    const snoozeButtonPress = useCallback((): void => {
        if (isSnoozing) return;
        setIsSnoozing(true);
        snoozeTimer.current = setTimeout(() => {
            setIsSnoozing(false);
            snoozeTimer.current = null;
            AuroraManagerInstance.setSleepState(SleepStates.AWAKE);
        }, SNOOZE_DURATION_MS);
    }, [isSnoozing]);

    return {
        wakeLockTextKey,
        onRelockPress: contentTextPress,
        onWakeupPress: wakeupButtonPress,
        onSnoozePress: snoozeButtonPress,
        isSnoozing,
        settings,
    };
};
//#endregion
