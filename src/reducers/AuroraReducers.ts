import { AuroraState } from "../state";
import { SettingsActions, ProfilesActions, SessionsActions } from "../actions";
import { Settings, AuroraSession } from "../sdk/models";
import { ActionTypes } from "../constants";
import { AuroraProfile } from "../sdk/AuroraTypes";
const initialState: AuroraState = {
    userSettings: new Settings({}),
    sessionList: new Array<AuroraSession>(),
    settingList: new Array<Settings>(),
    profileList: new Array<AuroraProfile>()
};

export default function AuroraReducers(
    state: AuroraState = initialState,
    action: SettingsActions | ProfilesActions | SessionsActions
): AuroraState {
    console.debug("AuroraReducer called.");
    let foundIndex;
    switch (action.type) {
        case ActionTypes.UPDATE_SETTINGS:
            foundIndex = state.settingList.findIndex((value: Settings) => {
                return value.userId === action.payload.userId!;
            });

            if (foundIndex >= 0) {
                state.settingList[foundIndex] = action.payload.data;
            } else {
                state.settingList.push(action.payload.data);
            }
            return Object.assign({}, state, {
                userSettings: action.payload.data,
                settingList: state.settingList
            });
        case ActionTypes.UPDATE_SESSIONS: {
            return Object.assign({}, state, {
                sessionList: action.payload.data
            });
        }
        case ActionTypes.UPDATE_PROFILES:
            return Object.assign({}, state, {
                profileList: action.payload.data
            });
        default:
            return state;
    }
}
