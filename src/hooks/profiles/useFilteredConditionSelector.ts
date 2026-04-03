import { useProfileStore, ProfileFilterCondition } from "../../store/profileStore";

export const useFilterConditionSelector = (): ProfileFilterCondition =>
    useProfileStore((state) => state.filterCondition);
