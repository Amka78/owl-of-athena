import { useSelector } from "react-redux";

import { RootState } from "../state";

const clientSelector = (state: RootState) => ({
    auroraClient: state.core.auroraClient
});

export const useClientSelector = () => {
    return useSelector(clientSelector);
};
