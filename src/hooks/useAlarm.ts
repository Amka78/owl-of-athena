//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useEffect, useSyncExternalStore } from "react";

import { AlarmRuntimeEventList, AlarmRuntimeInstance } from "../managers";
import type { AlarmState } from "../managers/alarm/AlarmScheduler";
import { useCheckLogging } from "./useCheckLogging";

//#endregion

//#region Functions
const subscribe = (onStoreChange: () => void): (() => void) => {
    AlarmRuntimeInstance.on(AlarmRuntimeEventList.onStateChange, onStoreChange);
    return () => {
        AlarmRuntimeInstance.off(AlarmRuntimeEventList.onStateChange, onStoreChange);
    };
};

const getAlarmState = (): AlarmState => AlarmRuntimeInstance.getState();
//#endregion

//#region Hooks
export const useAlarmState = (): AlarmState => useSyncExternalStore(subscribe, getAlarmState);

/** アラームの状態に合わせて Waking / Sleeping 画面へ切り替える。 */
export const useAlarm = (): void => {
    useCheckLogging();
    const { navigate } = useNavigation<any>();
    const alarmState = useAlarmState();

    useEffect(() => {
        const onSnoozed = (): void => navigate("Sleeping");
        AlarmRuntimeInstance.on(AlarmRuntimeEventList.onSnoozed, onSnoozed);
        return () => {
            AlarmRuntimeInstance.off(AlarmRuntimeEventList.onSnoozed, onSnoozed);
        };
    }, [navigate]);

    useEffect(() => {
        if (alarmState.phase === "ringing") {
            navigate("Waking");
        }
    }, [alarmState.phase, navigate]);
};
//#endregion
