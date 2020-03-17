/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Settings } from "../sdk/models";
import { ActionTypes } from "../constants";

export type SettingsActions = ReturnType<typeof updateSettings>;

export const updateSettings = (settings: Settings, userId: string) => ({
    payload: {
        data: settings,
        userId
    },
    type: ActionTypes.UPDATE_SETTINGS
});
