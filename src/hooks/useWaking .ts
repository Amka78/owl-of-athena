//#region Import Modules
import { useCallback } from "react";
import { AuroraManagerInstance } from "../managers";
import { SleepStates } from "../sdk";
import type { Settings } from "../sdk/models";
import { useCheckLogging, useSettingsSelector } from "./";
//#endregion

//#region Hooks
export const useWaking = (): {
    wakeupButtonPress: () => void;
    settings: Settings;
} => {
    useCheckLogging();
    const settings = useSettingsSelector();

    const wakeupButtonPress = useCallback((): void => {
        AuroraManagerInstance.setSleepState(SleepStates.AWAKE);
    }, []);
    return { settings, wakeupButtonPress };
};
//#endregion
