import { type SessionFilterCondition, useSessionStore } from "../../store/sessionStore";

export const useFilterConditionSelector = (): SessionFilterCondition =>
    useSessionStore((state) => state.filterCondition);
