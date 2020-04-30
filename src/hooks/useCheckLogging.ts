import { useEffect } from "react";

import { useTokenSelector } from ".";
import { useNavigation } from "react-navigation-hooks";
import {
    AuroraRestClientInstance,
    SessionRestClientInstance,
} from "../clients";

export const useCheckLogging = (): void => {
    const { navigate } = useNavigation();

    const token = useTokenSelector();
    useEffect(() => {
        let unmounted = false;
        const f = async (): Promise<void> => {
            if (!unmounted) {
                console.debug("useCheckLogging start");
                if (!token) {
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
