import { type ProfileFilterCondition, useProfileStore } from "../../store/profileStore";

export const useFilterConditionSelector = (): ProfileFilterCondition =>
    useProfileStore((state) => state.filterCondition);
