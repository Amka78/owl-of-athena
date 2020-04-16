import { useSelector } from "react-redux";

import { RootState } from "../state";
import { AuroraSession } from "../sdk/models";

const clientSelector = (state: RootState): Array<AuroraSession> =>
    state.session.filteredSessionList;

export const useFilteredSessionListSelector = (): Array<AuroraSession> => {
    return useSelector(clientSelector);
};
