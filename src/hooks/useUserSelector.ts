import { useSelector } from "react-redux";

import { RootState } from "../state";
import { User } from "../types";

const clientSelector = (state: RootState): User | undefined => state.auth.user;

export const useUserSelector = (): User | undefined => {
    return useSelector(clientSelector);
};
