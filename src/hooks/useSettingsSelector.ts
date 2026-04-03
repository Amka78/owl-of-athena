import { useAuroraStore } from "../store/auroraStore";
import { Settings } from "../sdk/models";

export const useSettingsSelector = (): Settings =>
    useAuroraStore((state) => state.userSettings);
