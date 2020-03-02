import { useSelector } from "react-redux";

import { RootState, UserInfoState } from "../state";

const clientSelector = (state: RootState): UserInfoState => ({
    user: state.userInfo.user
});

export const useUserSelector = (): UserInfoState => {
    return useSelector(clientSelector);
};
