import { useSelector } from "react-redux";

import { RootState } from "../state";
import { AuroraProfile } from "../sdk/AuroraTypes";

const clientSelector = (state: RootState): Array<AuroraProfile> =>
    state.aurora.profileList;

export const useProfilesSelector = (): Array<AuroraProfile> => {
    return useSelector(clientSelector);
};
