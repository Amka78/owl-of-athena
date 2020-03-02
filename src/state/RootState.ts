import { CoreState } from "./CoreState";
import { UserInfoState } from ".";

export type RootState = {
    core: CoreState;
    userInfo: UserInfoState;
};
