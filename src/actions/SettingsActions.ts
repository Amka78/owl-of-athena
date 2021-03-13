/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Settings } from "../sdk/models";
import { ActionTypes } from "../constants";

export type SettingsActions =
    | ReturnType<typeof cacheSettings>
    | ReturnType<typeof initialize>;

export const cacheSettings = (settings: Settings) => ({
    payload: {
        data: settings,
    },
    type: ActionTypes.CACHE_SETTINGS,
});

export const initialize = () => ({
    type: ActionTypes.INITIALIZE_AURORA,
});
