//#region Import Modules
import { useSelector } from "react-redux";

import { AuroraProfile } from "../../sdk/AuroraTypes";
import { RootState } from "../../state";
//#endregion

//#region Hooks
const clientSelector = (state: RootState): AuroraProfile | undefined =>
    state.profile.selected;

export const useSelectedProfileSelector = (): AuroraProfile | undefined => {
    return useSelector(clientSelector);
};
//#endregion
