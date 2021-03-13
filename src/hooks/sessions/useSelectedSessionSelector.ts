//#region Import Modules
import { useSelector } from "react-redux";

import { RootState } from "../../state";
import { AuroraSession } from "../../sdk/models";
//#endregion

//#region Hooks
const clientSelector = (state: RootState): AuroraSession | undefined =>
    state.session.selectedSession;

export const useSelectedSessionSelector = (): AuroraSession | undefined => {
    return useSelector(clientSelector);
};
//#endregion
