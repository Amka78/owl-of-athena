import { useSessionStore } from "../../store/sessionStore";
import { AuroraSessionDetail } from "../../sdk/models";

export const useSelectedSessionDetailSelector = ():
    | AuroraSessionDetail
    | undefined => useSessionStore((state) => state.selectedSessionDetail);
