import { useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import {
    AuroraRestClientInstance,
    SessionRestClientInstance,
} from "../clients";
import { useAuthStore } from "../store/authStore";
import { useTokenSelector, useUserSelector } from "../hooks";

import { GuestUser } from "../types";

//#region Hooks
export const useAutoLogin = (): void => {
    const { navigate } = useNavigation<any>();

    const { updateUser } = useAuthStore();
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
                        updateUser(currentUser);
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
    }, [navigate, token, user]);

    return;
};
//#endregion
