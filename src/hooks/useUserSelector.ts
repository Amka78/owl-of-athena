import { useSelector } from "react-redux";

import { RootState } from "../state";

const clientSelector = (state: RootState) => ({
    user: state.core.user
});

export const useUserSelector = () => {
    return useSelector(clientSelector);
};
