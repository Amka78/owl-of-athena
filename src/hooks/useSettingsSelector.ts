import type { Settings } from "../sdk/models";
import { useAuroraStore } from "../store/auroraStore";

export const useSettingsSelector = (): Settings => useAuroraStore((state) => state.userSettings);
