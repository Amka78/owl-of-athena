import * as Localization from "expo-localization";
import { AuroraClient } from "../clients";
import { ActionTypes } from "../constants";
import { BaseUrl, TokenManager } from "../utils";
import { CoreState } from "../state";
import { AuthActions } from "../actions";

const getToken = async (): Promise<string | undefined> => {
    return TokenManager.get() ? TokenManager.get() : undefined;
};

const initialState: CoreState = {
    auroraClient: new AuroraClient(BaseUrl.get(), Localization.locale, getToken)
};

export default function UserInfoReducer(
    state: CoreState = initialState,
    action: AuthActions
): CoreState {
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
