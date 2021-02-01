//#region Import Modules
import { useEffect } from "react";

import { useTokenSelector, useUserSelector } from ".";
import { useNavigation } from "@react-navigation/native";
import {
    AuroraRestClientInstance,
    SessionRestClientInstance,
} from "../clients";
import { GuestUser } from "../types";
//#endregion

//#region Hooks
export const useCheckLogging = (): void => {
    const { navigate } = useNavigation();

    const token = useTokenSelector();
    const user = useUserSelector();
    useEffect(() => {
        let unmounted = false;
        const f = async (): Promise<void> => {
            if (!unmounted) {
                console.debug("useCheckLogging start");
                if (!token && user?.id !== GuestUser) {
                    navigate("Welcome");
                } else {
                    if (!AuroraRestClientInstance.getTokenCallback) {
                        AuroraRestClientInstance.getTokenCallback = (): string =>
                            token;
                    }

                    if (!SessionRestClientInstance.getTokenCallback) {
                        SessionRestClientInstance.getTokenCallback = (): string =>
                            token;
                    }
                }
            }
        };
        f();
        const cleanup = (): void => {
            unmounted = true;
        };
        return cleanup;
    }, [navigate, token]);

    return;
};
//#endregion
