import { useSessionStore } from "../../store/sessionStore";
import { AuroraSession } from "../../sdk/models";

export const useSelectedSessionSelector = (): AuroraSession | undefined =>
    useSessionStore((state) => state.selectedSession);
