import { useSelector } from "react-redux";

import { RootState } from "../state";

const clientSelector = (state: RootState): boolean => state.app.wakeLock;

export const useWakeLockSelector = (): boolean => {
    return useSelector(clientSelector);
};
