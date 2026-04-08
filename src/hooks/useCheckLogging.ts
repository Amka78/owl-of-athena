//#region Import Modules

import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { AuroraRestClientInstance, SessionRestClientInstance } from "../clients";
import { GuestUser } from "../types";
import { useTokenSelector, useUserSelector } from ".";
//#endregion

//#region Hooks
export const useCheckLogging = (): void => {
    const { navigate } = useNavigation<any>();

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
                        AuroraRestClientInstance.getTokenCallback = (): string => token!;
                    }

                    if (!SessionRestClientInstance.getTokenCallback) {
                        SessionRestClientInstance.getTokenCallback = (): string => token!;
                    }
                }
            }
        };
        f();
        const cleanup = (): void => {
            unmounted = true;
        };
        return cleanup;
    }, [navigate, token, user?.id]);

    return;
};
//#endregion
