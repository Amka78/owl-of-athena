//#region Import Modules
import { useCallback } from "react";
import { useCheckLogging, useSettingsSelector } from "./";
import { Settings } from "../sdk/models";
import { AuroraManagerInstance } from "../managers";
import { SleepStates } from "../sdk";
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
