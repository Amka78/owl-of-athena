//#region Import Modules
import { useSelector } from "react-redux";

import { AuroraSession } from "../../sdk/models";
import { RootState } from "../../state";
//#endregion

//#region Hooks
const clientSelector = (state: RootState): Array<AuroraSession> =>
    state.session.sessionList;

export const useSessionListSelector = (): Array<AuroraSession> => {
    return useSelector(clientSelector);
};
//#endregion
