import type { AuroraProfile } from "../../sdk/AuroraTypes";
import { useProfileStore } from "../../store/profileStore";

export const useProfileListSelector = (): Array<AuroraProfile> =>
    useProfileStore((state) => state.list);
