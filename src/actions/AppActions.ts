/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ActionTypes } from "../constants";
import { WakeLockSentinel } from "../types";

export type AppActions = ReturnType<typeof setWakeLock>;

export const setWakeLock = (wakeLock?: WakeLockSentinel) => ({
    payload: {
        data: wakeLock,
    },
    type: ActionTypes.WAKELOCK,
});
