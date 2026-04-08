import { useProfileStore } from "../../store/profileStore";
import type { AuroraProfile } from "../../sdk/AuroraTypes";

export const useSelectedProfileSelector = (): AuroraProfile | undefined =>
    useProfileStore((state) => state.selected);
