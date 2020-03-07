import { useSelector } from "react-redux";

import { RootState } from "../state";
import { Aurora } from "../sdk/Aurora";
const clientSelector = (state: RootState): Aurora => state.core.auroraDevice;

export const useAuroraSelector = (): Aurora => {
    return useSelector(clientSelector);
};
