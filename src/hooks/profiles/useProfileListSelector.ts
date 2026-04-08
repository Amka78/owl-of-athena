import { useProfileStore } from "../../store/profileStore";
import type { AuroraProfile } from "../../sdk/AuroraTypes";

export const useProfileListSelector = (): Array<AuroraProfile> =>
    useProfileStore((state) => state.list);
