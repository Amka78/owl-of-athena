import { AppState } from "../state";
import { AppActions } from "../actions";
import { ActionTypes } from "../constants";
const initialState: AppState = {
    wakeLock: false,
};

export default function AppReducers(
    state: AppState = initialState,
    action: AppActions
): AppState {
    switch (action.type) {
        case ActionTypes.WAKELOCK:
            return Object.assign({}, state, {
                wakeLock: action.payload.data,
            });
        default:
            return state;
    }
}
