//#region Import Modules
import { SettingsActions } from "../actions/SettingsActions";
import { ActionTypes } from "../constants";
import { Settings } from "../sdk/models";
import { AuroraState } from "../state";
//#endregion

//#region InitialState
const initialState: AuroraState = {
    userSettings: new Settings({}),
};
//#endregion

//#region Reducers
export default function AuroraReducers(
    state: AuroraState,
    action: SettingsActions
): AuroraState {
    if (state === undefined) {
        state = initialState;
    }
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
//#endregion
