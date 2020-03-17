import { useSelector } from "react-redux";

import { RootState } from "../state";
import { Settings } from "../sdk/models";

const clientSelector = (state: RootState): Settings =>
    state.aurora.userSettings;

export const useSettingsSelector = (): Settings => {
    return useSelector(clientSelector);
};
