//#region Import Modules
import { useSelector } from "react-redux";

import { RootState } from "../../state";
//#endregion

//#region Import Hooks
const clientSelector = (state: RootState): Array<any> =>
    state.session.sessionDetailList;

export const useSessionDetailListSelector = (): Array<any> => {
    return useSelector(clientSelector);
};
//#endregion
