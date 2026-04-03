import { useSessionStore } from "../../store/sessionStore";
import { AuroraSession } from "../../sdk/models";

export const useSessionListSelector = (): Array<AuroraSession> =>
    useSessionStore((state) => state.sessionList);
