import { useEffect } from "react";

import { useTokenSelector } from ".";
import { useNavigation } from "react-navigation-hooks";

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
