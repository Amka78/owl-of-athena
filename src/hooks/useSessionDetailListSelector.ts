import { useSelector } from "react-redux";

import { RootState } from "../state";

const clientSelector = (state: RootState): Array<any> =>
    state.session.sessionDetailList;

export const useSessionDetailListSelector = (): Array<any> => {
    return useSelector(clientSelector);
};
