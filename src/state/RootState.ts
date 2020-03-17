import { AuroraState } from "./AuroraState";
import { UserInfoState } from ".";

export type RootState = {
    aurora: AuroraState;
    userInfo: UserInfoState;
};
