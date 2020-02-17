import { useEffect } from "react";

import { TokenManager } from "../utils";
import { useNavigation } from "react-navigation-hooks";

export const useCheckLogging = (): void => {
    const { navigate } = useNavigation();

    useEffect(() => {
        let unmounted = false;
        const f = async (): Promise<void> => {
            if (!unmounted) {
                console.debug("useCheckLogging start");
                if (!(await TokenManager.hasToken())) {
                    navigate("Welcome");
                }
            }
        };
        f();
        const cleanup = (): void => {
            unmounted = true;
        };
        return cleanup;
    }, [navigate]);

    return;
};
