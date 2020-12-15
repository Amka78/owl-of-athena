import { AuroraState, AppState, SessionState, AuthState } from ".";

export type RootState = {
    aurora: AuroraState;
    app: AppState;
    session: SessionState;
    auth: AuthState;
};
