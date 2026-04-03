import { useProfileStore } from "../../store/profileStore";
import { AuroraProfile } from "../../sdk/AuroraTypes";

export const useFilteredProfileListSelector = (): Array<AuroraProfile> =>
    useProfileStore((state) => state.filteredList);
