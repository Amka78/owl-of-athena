import type { AuroraSession } from "../../sdk/models";
import { useSessionStore } from "../../store/sessionStore";

export const useSelectedSessionSelector = (): AuroraSession | undefined =>
    useSessionStore((state) => state.selectedSession);
