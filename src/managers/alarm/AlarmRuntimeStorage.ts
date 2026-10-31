//#region Import Modules
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AlarmSnapshot, AlarmStorage } from "./AlarmRuntime";

//#endregion

//#region Constants
const STORAGE_KEY = "alarm-runtime";
//#endregion

//#region Export
export const alarmStorage: AlarmStorage = {
    load: async (): Promise<AlarmSnapshot | null> => {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw === null) return null;
        try {
            return JSON.parse(raw) as AlarmSnapshot;
        } catch (e) {
            console.error("[alarmStorage] failed to parse saved alarm", e);
            return null;
        }
    },
    save: async (snapshot: AlarmSnapshot): Promise<void> => {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    },
    clear: async (): Promise<void> => {
        await AsyncStorage.removeItem(STORAGE_KEY);
    },
};
//#endregion
