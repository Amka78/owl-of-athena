import { AuroraState } from "../state";
import { SettingsActions, ProfilesActions } from "../actions";
import { Settings } from "../sdk/models";
import { ActionTypes } from "../constants";
import { AuroraProfile } from "../sdk/AuroraTypes";
const initialState: AuroraState = {
    userSettings: new Settings({}),
    profileList: new Array<AuroraProfile>(),
};

export default function AuroraReducers(
    state: AuroraState = initialState,
    action: SettingsActions | ProfilesActions
): AuroraState {
    switch (action.type) {
        case ActionTypes.CACHE_SETTINGS:
            return Object.assign({}, state, {
                userSettings: action.payload.data,
            });
        case ActionTypes.CACHE_PROFILES:
            return Object.assign({}, state, {
                profileList: action.payload.data,
            });
        case ActionTypes.INITIALIZE_AURORA:
            return Object.assign({}, state, {
                userSettings: new Settings({}),
                profileList: new Array<AuroraProfile>(),
            });
        default:
            return state;
    }
}
