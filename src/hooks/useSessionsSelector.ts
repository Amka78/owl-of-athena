import { useSelector } from "react-redux";

import { RootState } from "../state";
import { AuroraSession } from "../sdk/models";

const clientSelector = (state: RootState): Array<AuroraSession> =>
    state.aurora.sessionList;

export const useSessionsSelector = (): Array<AuroraSession> => {
    return useSelector(clientSelector);
};
