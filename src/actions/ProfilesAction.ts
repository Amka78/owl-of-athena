/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AuroraProfile } from "../sdk/AuroraTypes";
import { ActionTypes } from "../constants";

export type ProfilesActions = ReturnType<typeof updateProfiles>;

export const updateProfiles = (profiles: Array<AuroraProfile>) => ({
    payload: {
        data: profiles
    },
    type: ActionTypes.UPDATE_PROFILES
});
