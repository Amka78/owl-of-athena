import type { AuroraProfile } from "../../sdk/AuroraTypes";
import { useProfileStore } from "../../store/profileStore";

export const useFilteredProfileListSelector = (): Array<AuroraProfile> =>
    useProfileStore((state) => state.filteredList);
