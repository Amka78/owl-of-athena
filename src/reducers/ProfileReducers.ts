//#region  "Import modules"
import _ from "lodash";

import { ProfilesActions } from "../actions";
import {
    CacheAction,
    DeleteAction,
    SelectAction,
    UpdateAction,
    UpdateFilterAction,
} from "../actions/ProfilesActions";
import { ActionTypes } from "../constants";
import { AuroraProfile } from "../sdk/AuroraTypes";
import { FilterCondition, ProfileState } from "../state/ProfileState";
//#endregion

//#region "Export functions"
export const initialState: ProfileState = {
    list: new Array<AuroraProfile>(),
    filteredList: new Array<AuroraProfile>(),
    filterCondition: {
        showOfficial: true,
        showCommunity: true,
        showPrivate: true,
    },
    selected: undefined,
};

export default function ProfileReducers(
    state: ProfileState = initialState,
    action: ProfilesActions
): ProfileState {
    switch (action.type) {
        case ActionTypes.CACHE_PROFILES: {
            return cache(state, action);
        }
        case ActionTypes.UPDATE_PROFILE_FILTER: {
            return updateFilter(state, action);
        }
        case ActionTypes.SELECT_PROFILE: {
            return select(state, action);
        }
        case ActionTypes.UPDATE_PROFILE: {
            return update(state, action);
        }
        case ActionTypes.DELETE_PROFILE: {
            return deleteBy(state, action);
        }
        case ActionTypes.INITIALIZE_PROFILES: {
            return initialize(state);
        }
        default:
            return state;
    }
}
//#endregion

//#region "Private functions"
/**
 * Deletes the profile with the specified ID.
 *
 * @param {ProfileState} state
 * @param {{ payload: { profileId: string }; type: "DELETE_PROFILE" }} action
 * @returns {ProfileState}
 */
function deleteBy(state: ProfileState, action: DeleteAction): ProfileState {
    const removedProfileList = _.remove(state.list, (value: AuroraProfile) => {
        return value.id !== action.payload.profileId;
    });
    return Object.assign({}, state, {
        list: removedProfileList,
        filteredList: createFilteredProfileList(
            removedProfileList,
            state.filterCondition
        ),
    });
}

/**
 * Narrow down the list of profiles based on the filter condition.
 *
 * @param {Array<AuroraProfile>} list
 * @param {Partial<FilterCondition>} filterCondition
 * @returns {Array<AuroraProfile>}
 */
function createFilteredProfileList(
    list: Array<AuroraProfile>,
    filterCondition: Partial<FilterCondition>
): Array<AuroraProfile> {
    const filteredProfileList = new Array<AuroraProfile>();

    for (const profile of list) {
        if (filterCondition.showOfficial) {
            if (profile.type === "official") {
                filteredProfileList.push(profile);
                continue;
            }
        }

        if (filterCondition.showCommunity) {
            if (profile.type === "community") {
                filteredProfileList.push(profile);
                continue;
            }
        }
        if (filterCondition.showPrivate) {
            if (profile.type == "private") {
                filteredProfileList.push(profile);
                continue;
            }
        }
    }
    return filteredProfileList;
}

/**
 * Return the session to its initial state.
 *
 * @param {ProfileState} state
 * @returns {ProfileState}
 */
function initialize(state: ProfileState): ProfileState {
    return Object.assign({}, state, initialState);
}

/**
 * Update the State in the specified profile.
 *
 * @param {ProfileState} state
 * @param {{ payload: { session: AuroraProfile }; type: "UPDATE_PROFILE" }} action
 * @returns {ProfileState}
 */
function update(state: ProfileState, action: UpdateAction): ProfileState {
    const targetIndex = state.list.findIndex((value: AuroraProfile) => {
        return value.id === action.payload.profile.id;
    });
    state.list[targetIndex] = action.payload.profile;
    return Object.assign({}, state, {
        list: state.list,
        filteredProfileList: createFilteredProfileList(
            state.list,
            state.filterCondition
        ),
    });
}

/**
 * Sets the specified profile to the selected state.
 *
 * @param {ProfileState} state
 * @param {{ payload: { session: AuroraProfile }; type: "SELECT_PROFILES" }} action
 * @returns {ProfileState}
 */
function select(state: ProfileState, action: SelectAction): ProfileState {
    return Object.assign({}, state, {
        selected: action.payload.profile,
    });
}

/**
 * Update FilterCondition.
 *
 * @param {ProfileState} state
 * @param {{
 *         payload: { filter: Partial<FilterCondition> };
 *         type: "UPDATE_PROFILE_FILTER";
 *     }} action
 * @returns {ProfileState}
 */
function updateFilter(
    state: ProfileState,
    action: UpdateFilterAction
): ProfileState {
    if (action.payload.filter.showOfficial !== undefined) {
        state.filterCondition.showOfficial = action.payload.filter.showOfficial;
    }
    if (action.payload.filter.showCommunity !== undefined) {
        state.filterCondition.showCommunity =
            action.payload.filter.showCommunity;
    }
    if (action.payload.filter.showPrivate !== undefined) {
        state.filterCondition.showPrivate = action.payload.filter.showPrivate;
    }
    return Object.assign({}, state, {
        filteredList: createFilteredProfileList(
            state.list,
            state.filterCondition
        ),
        filterCondition: state.filterCondition,
    });
}

/**
 * Save the profile list.
 *
 * @param {ProfileState} state
 * @param {{
 *         payload: { list: AuroraProfile[] };
 *         type: "CACHE_PROFILES";
 *     }} action
 * @returns {ProfileState}
 */
function cache(state: ProfileState, action: CacheAction): ProfileState {
    return Object.assign({}, state, {
        filteredList: createFilteredProfileList(
            action.payload.list,
            state.filterCondition
        ),
        list: action.payload.list,
    });
}
//#endregion
