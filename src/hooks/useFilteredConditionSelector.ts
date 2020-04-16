import { useSelector } from "react-redux";

import { RootState } from "../state";
import { FilterCondition } from "../state/SessionState";

const clientSelector = (state: RootState): FilterCondition =>
    state.session.filterCondition;

export const useFilterConditionSelector = (): FilterCondition => {
    return useSelector(clientSelector);
};
