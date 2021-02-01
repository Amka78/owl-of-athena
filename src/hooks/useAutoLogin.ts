//#region Import Modules
import { useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import {
    AuroraRestClientInstance,
    SessionRestClientInstance,
} from "../clients";
import { useDispatch } from "react-redux";
import { useTokenSelector, useUserSelector } from "../hooks";

import { updateUser } from "../actions";
import { GuestUser } from "../types";
//#endregion

//#region Hooks
export const useAutoLogin = (): void => {
    const { navigate } = useNavigation();

    const dispatch = useDispatch();
    const user = useUserSelector();
    const token = useTokenSelector();
    useEffect(() => {
        let unmounted = false;
        const f = async (): Promise<void> => {
            if (!unmounted) {
                console.debug("useAutoLogin start");
                if (token) {
                    if (!user) {
                        const currentUser = await AuroraRestClientInstance.getAuthUser();
                        dispatch(updateUser(currentUser));
                    }
                    AuroraRestClientInstance.getTokenCallback = (): string =>
                        token;
                    SessionRestClientInstance.getTokenCallback = (): string =>
                        token;
                    navigate("Main");
                } else if (user?.id === GuestUser) {
                    navigate("Main");
                }
            }
        };
        f();
        const cleanup = (): void => {
            unmounted = true;
        };
        return cleanup;
    }, [dispatch, navigate, token, user]);

    return;
};
//#endregion
