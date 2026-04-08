import type { AuroraSessionDetail } from "../../sdk/models";
import { useSessionStore } from "../../store/sessionStore";

export const useSessionDetailListSelector = (): Array<AuroraSessionDetail> =>
    useSessionStore((state) => state.sessionDetailList);
