import { useSelector } from "react-redux";

import { RootState } from "../state";

const clientSelector = (state: RootState): string | undefined =>
    state.auth.token;

export const useTokenSelector = (): string | undefined => {
    return useSelector(clientSelector);
};
