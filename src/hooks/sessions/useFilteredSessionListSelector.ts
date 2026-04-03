import { useSessionStore } from "../../store/sessionStore";
import { AuroraSession } from "../../sdk/models";

export const useFilteredSessionListSelector = (): Array<AuroraSession> =>
    useSessionStore((state) => state.filteredSessionList);
