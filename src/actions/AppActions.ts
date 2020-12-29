/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ActionTypes } from "../constants";

export type AppActions = ReturnType<typeof setWakeLock>;

export const setWakeLock = (wakeLock: boolean) => ({
    payload: {
        data: wakeLock,
    },
    type: ActionTypes.WAKELOCK,
});
