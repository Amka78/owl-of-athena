//#region Import Modules
import { useSelector } from "react-redux";

import { AuroraProfile } from "../../sdk/AuroraTypes";
import { RootState } from "../../state";
//#endregion

//#region Hooks
const clientSelector = (state: RootState): Array<AuroraProfile> =>
    state.profile.filteredList;

export const useFilteredProfileListSelector = (): Array<AuroraProfile> => {
    return useSelector(clientSelector);
};
//#endregion
