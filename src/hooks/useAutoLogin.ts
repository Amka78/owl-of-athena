import { useEffect } from "react";

import { TokenManager } from "../utils";
import { useNavigation } from "react-navigation-hooks";

export const useAutoLogin = (): void => {
    const { navigate } = useNavigation();

    useEffect(() => {
        let unmounted = false;
        const f = async (): Promise<void> => {
            if (!unmounted) {
                console.debug("useAutoLogin start");
                if (await TokenManager.hasToken()) {
                    navigate("Main");
                }
            }
        };
        f();
        const cleanup = (): void => {
            unmounted = true;
        };
        return cleanup;
    }, []);

    return;
};
