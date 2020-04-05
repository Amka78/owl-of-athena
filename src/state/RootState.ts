import { AuroraState, SessionState, AuthState } from ".";

export type RootState = {
    aurora: AuroraState;
    session: SessionState;
    auth: AuthState;
};
