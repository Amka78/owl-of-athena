//#region Import Modules
import { SettingsActions } from "../actions";
import { ActionTypes } from "../constants";
import { Settings } from "../sdk/models";
import { AuroraState } from "../state";
//#endregion

const initialState: AuroraState = {
    userSettings: new Settings({}),
};

export default function AuroraReducers(
    state: AuroraState = initialState,
    action: SettingsActions
): AuroraState {
    switch (action.type) {
        case ActionTypes.CACHE_SETTINGS:
            return Object.assign({}, state, {
                userSettings: action.payload.data,
            });
        case ActionTypes.INITIALIZE_AURORA:
            return Object.assign({}, state, {
                userSettings: new Settings({}),
            });
        default:
            return state;
    }
}
