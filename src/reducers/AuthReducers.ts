import { ActionTypes } from "../constants";
import { AuthState } from "../state";
import { AuthActions } from "../actions";

export default function AuthReducers(
    state: AuthState = {},
    action: AuthActions
): AuthState {
    switch (action.type) {
        case ActionTypes.LOGIN:
            return Object.assign({}, state, {
                user: action.payload.data,
                token: action.payload.token,
                lastUsedEmail:
                    action.payload.data.providers?.email.provider_key,
            });
        case ActionTypes.LOGOUT:
            return Object.assign({}, state, {
                user: undefined,
                token: undefined,
            });
        case ActionTypes.UPDATE_USER:
            return Object.assign({}, state, {
                user: action.payload.data,
            });
        default:
            return state;
    }
}
