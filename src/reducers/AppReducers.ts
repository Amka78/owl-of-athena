//#region Import Modules
import { AppActions } from "../actions/AppActions";
import { ActionTypes } from "../constants";
import { AppState } from "../state";
//#endregion

//#region Types
const initialState: AppState = {
    wakeLock: false,
};
//#endregion

//#region Reducers
export default function AppReducers(
    state: AppState,
    action: AppActions
): AppState {
    if (state === undefined) {
        state = initialState;
    }
    switch (action.type) {
        case ActionTypes.WAKELOCK:
            return Object.assign({}, state, {
                wakeLock: action.payload.data,
            });
        default:
            return state;
    }
}
//#endregion
