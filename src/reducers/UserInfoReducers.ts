import * as Localization from "expo-localization";
import { AuroraClient } from "../clients";
import { ActionTypes } from "../constants";
import { BaseUrl } from "../utils";
import { CoreState } from "../state";

const initialState: CoreState = {
    auroraClient: new AuroraClient(BaseUrl.get(), Localization.locale)
};

export default function UserInfoReducer(
    state: CoreState = initialState,
    action: any
) {
    switch (action.type) {
        case ActionTypes.LOGIN_SUCCESS:
            return Object.assign({}, state, {
                token: action.payload.data.token,
                user: action.payload.data.user
            });
        case ActionTypes.CHANGE_ACCOUNT_ID_SUCCESS:
        case ActionTypes.CHANGE_PASSWORD_SUCCESS:
        case ActionTypes.UPDATE_USER:
            return Object.assign({}, state, {
                user: action.payload.data
            });
        default:
            return state;
    }
}
