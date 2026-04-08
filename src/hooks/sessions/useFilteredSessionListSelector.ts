import type { AuroraSession } from "../../sdk/models";
import { useSessionStore } from "../../store/sessionStore";

export const useFilteredSessionListSelector = (): Array<AuroraSession> =>
    useSessionStore((state) => state.filteredSessionList);
