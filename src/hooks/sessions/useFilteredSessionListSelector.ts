//#region Import Modules
import { useSelector } from "react-redux";

import { AuroraSession } from "../../sdk/models";
import { RootState } from "../../state";
//#endregion

//#region Hooks
const clientSelector = (state: RootState): Array<AuroraSession> =>
    state.session.filteredSessionList;

export const useFilteredSessionListSelector = (): Array<AuroraSession> => {
    return useSelector(clientSelector);
};
//#endregion
