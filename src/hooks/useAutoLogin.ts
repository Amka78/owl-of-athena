import { useEffect } from "react";

import { TokenManager } from "../utils";
import { useNavigation } from "react-navigation-hooks";
import { AuroraRestClientInstance } from "../clients";
import { useDispatch } from "react-redux";
import { useUserSelector } from "../hooks";
import { updateUser } from "../actions";
export const useAutoLogin = (): void => {
    const { navigate } = useNavigation();

    const dispatch = useDispatch();
    const user = useUserSelector();
    useEffect(() => {
        let unmounted = false;
        const f = async (): Promise<void> => {
            if (!unmounted) {
                console.debug("useAutoLogin start");
                if (await TokenManager.hasToken()) {
                    if (!user) {
                        const currentUser = await AuroraRestClientInstance.getAuthUser();
                        dispatch(updateUser(currentUser));
                    }
                    navigate("Main");
                }
            }
        };
        f();
        const cleanup = (): void => {
            unmounted = true;
        };
        return cleanup;
    }, [dispatch, navigate, user]);

    return;
};
