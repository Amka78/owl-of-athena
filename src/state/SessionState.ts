import { AuroraSession, AuroraSessionDetail } from "../sdk/models";
export type SessionState = {
    sessionList: Array<AuroraSession>;
    selectedSession?: AuroraSession;
    sessionDetailList: Array<AuroraSessionDetail>;
    selectedSessionDetail?: AuroraSessionDetail;
};
