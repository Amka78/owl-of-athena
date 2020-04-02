import { AuroraState, SessionState, UserInfoState } from ".";

export type RootState = {
    aurora: AuroraState;
    session: SessionState;
    userInfo: UserInfoState;
};
