import type { AuroraSession } from "../../sdk/models";
import { useSessionStore } from "../../store/sessionStore";

export const useSessionListSelector = (): Array<AuroraSession> =>
    useSessionStore((state) => state.sessionList);
