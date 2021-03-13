/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
//#region Import Modules
import { ActionTypes } from "../constants";
import { AuroraProfile } from "../sdk/AuroraTypes";
import { FilterCondition } from "../state/ProfileState";
//#endregion

//#region Types
export type CacheAction = ReturnType<typeof cache>;
export type UpdateFilterAction = ReturnType<typeof updateFilter>;
export type SelectAction = ReturnType<typeof select>;
export type UpdateAction = ReturnType<typeof update>;
export type DeleteAction = ReturnType<typeof deleteById>;
export type InitializeAction = ReturnType<typeof initialize>;
export type ProfilesActions =
    | CacheAction
    | UpdateFilterAction
    | SelectAction
    | UpdateAction
    | DeleteAction
    | InitializeAction;
//#endregion

//#region Functions
export const cache = (list: Array<AuroraProfile>) => ({
    payload: {
        list,
    },
    type: ActionTypes.CACHE_PROFILES,
});

export const updateFilter = (filter: Partial<FilterCondition>) => ({
    payload: {
        filter,
    },
    type: ActionTypes.UPDATE_PROFILE_FILTER,
});

export const select = (profile: AuroraProfile) => ({
    payload: {
        profile,
    },
    type: ActionTypes.SELECT_PROFILE,
});

export const update = (profile: AuroraProfile) => ({
    payload: {
        profile,
    },
    type: ActionTypes.UPDATE_PROFILE,
});

export const deleteById = (profileId: string) => ({
    payload: {
        profileId,
    },
    type: ActionTypes.DELETE_PROFILE,
});

export const initialize = () => ({
    type: ActionTypes.INITIALIZE_PROFILES,
});
//#endregion
