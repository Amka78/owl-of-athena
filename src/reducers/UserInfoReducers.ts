import { ActionTypes } from "../constants";
import { UserInfoState } from "../state";
import { UserActions } from "../actions";

export default function UserInfoReducer(
    state: UserInfoState = {},
    action: UserActions
): UserInfoState {
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
