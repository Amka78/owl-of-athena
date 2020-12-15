/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AuroraProfile } from "../sdk/AuroraTypes";
import { ActionTypes } from "../constants";

export type ProfilesActions =
    | ReturnType<typeof updateProfiles>
    | ReturnType<typeof initializeAurora>;

export const updateProfiles = (profiles: Array<AuroraProfile>) => ({
    payload: {
        data: profiles,
    },
    type: ActionTypes.CACHE_PROFILES,
});

export const initializeAurora = () => ({
    type: ActionTypes.INITIALIZE_AURORA,
});
