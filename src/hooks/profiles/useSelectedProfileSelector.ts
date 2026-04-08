import type { AuroraProfile } from "../../sdk/AuroraTypes";
import { useProfileStore } from "../../store/profileStore";

export const useSelectedProfileSelector = (): AuroraProfile | undefined =>
    useProfileStore((state) => state.selected);
