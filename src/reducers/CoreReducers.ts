import * as Localization from "expo-localization";
import { AuroraRestClient } from "../clients";
import { BaseUrl, TokenManager } from "../utils";
import { CoreState } from "../state";
import { AuthActions } from "../actions";
import Aurora from "../sdk/Aurora";

const getToken = async (): Promise<string | undefined> => {
    return TokenManager.get() ? TokenManager.get() : undefined;
};

const initialState: CoreState = {
    restClient: new AuroraRestClient(
        BaseUrl.get(),
        Localization.locale,
        getToken
    ),
    auroraDevice: Aurora
};

export default function CoreReducer(
    state: CoreState = initialState,
    action: AuthActions
): CoreState {
    console.debug("coreReducer initialized.");
    switch (action.type) {
        default:
            return state;
    }
}
