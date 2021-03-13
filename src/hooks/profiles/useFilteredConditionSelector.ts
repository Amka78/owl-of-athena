//#region Import Modules
import { useSelector } from "react-redux";

import { RootState } from "../../state";
import { FilterCondition } from "../../state/ProfileState";
//#endregion

//#region Hooks
const clientSelector = (state: RootState): FilterCondition =>
    state.profile.filterCondition;

export const useFilterConditionSelector = (): FilterCondition => {
    return useSelector(clientSelector);
};
//#endregion
