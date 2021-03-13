import {
    AuroraState,
    AppState,
    ProfileState,
    SessionState,
    AuthState,
} from ".";

export type RootState = {
    aurora: AuroraState;
    app: AppState;
    session: SessionState;
    profile: ProfileState;
    auth: AuthState;
};
