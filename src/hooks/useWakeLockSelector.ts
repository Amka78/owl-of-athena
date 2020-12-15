import { useSelector } from "react-redux";

import { RootState } from "../state";
import { WakeLockSentinel } from "../types";

const clientSelector = (state: RootState): WakeLockSentinel | undefined =>
    state.app.wakeLock;

export const useWakeLockSelector = (): WakeLockSentinel | undefined => {
    return useSelector(clientSelector);
};
