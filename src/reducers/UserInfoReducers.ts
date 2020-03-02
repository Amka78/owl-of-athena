import { ActionTypes } from "../constants";
import { UserInfoState } from "../state";
import { AuthActions } from "../actions";

export default function UserInfoReducer(
    state: UserInfoState = {},
    action: AuthActions
): UserInfoState {
    console.debug("userInfoReducer initialized.");
    switch (action.type) {
        case ActionTypes.LOGIN:
            return Object.assign({}, state, {
                user: action.payload.data
            });
        case ActionTypes.UPDATE_USER:
            return Object.assign({}, state, {
                user: action.payload.data
            });
        default:
            return state;
    }
}
