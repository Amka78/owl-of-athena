//#region Import Modules
import { useCallback } from "react";
import { AlarmRuntimeInstance } from "../managers";
import type { Settings } from "../sdk/models";
import { useCheckLogging, useSettingsSelector } from "./";
//#endregion

//#region Hooks
export const useWaking = (): {
    wakeupButtonPress: () => void;
    snoozeButtonPress: () => void;
    settings: Settings;
} => {
    useCheckLogging();
    const settings = useSettingsSelector();

    const wakeupButtonPress = useCallback((): void => {
        void AlarmRuntimeInstance.dismiss();
    }, []);

    const snoozeButtonPress = useCallback((): void => {
        void AlarmRuntimeInstance.snooze();
    }, []);

    return { settings, wakeupButtonPress, snoozeButtonPress };
};
//#endregion
