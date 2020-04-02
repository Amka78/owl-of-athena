import { useSelector } from "react-redux";

import { RootState } from "../state";

const clientSelector = (state: RootState): any | undefined =>
    state.session.selectedSessionDetail;

export const useSelectedSessionDetailSelector = (): any | undefined => {
    return useSelector(clientSelector);
};
