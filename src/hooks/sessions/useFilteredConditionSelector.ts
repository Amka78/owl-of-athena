import { useSessionStore, SessionFilterCondition } from "../../store/sessionStore";

export const useFilterConditionSelector = (): SessionFilterCondition =>
    useSessionStore((state) => state.filterCondition);
