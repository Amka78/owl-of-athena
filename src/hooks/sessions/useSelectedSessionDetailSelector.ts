import type { AuroraSessionDetail } from "../../sdk/models";
import { useSessionStore } from "../../store/sessionStore";

export const useSelectedSessionDetailSelector = (): AuroraSessionDetail | undefined =>
    useSessionStore((state) => state.selectedSessionDetail);
