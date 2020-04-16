/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Settings } from "../sdk/models";
import { ActionTypes } from "../constants";

export type SettingsActions = ReturnType<typeof cacheSettings>;

export const cacheSettings = (settings: Settings) => ({
    payload: {
        data: settings,
    },
    type: ActionTypes.CACHE_SETTINGS,
});
