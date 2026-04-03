import { useSessionStore } from "../../store/sessionStore";
import { AuroraSessionDetail } from "../../sdk/models";

export const useSessionDetailListSelector = (): Array<AuroraSessionDetail> =>
    useSessionStore((state) => state.sessionDetailList);
