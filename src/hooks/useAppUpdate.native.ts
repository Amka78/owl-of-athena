//#region Import Modules

import * as Updates from "expo-updates";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

//#endregion

//#region Constants
const CHECK_INTERVAL_MS = 15 * 60 * 1000;
//#endregion

//#region Hooks
export const useAppUpdate = (): {
    reloadPageCallback: () => void;
    dismissReloadCallback: () => void;
    showReload: boolean;
} => {
    const [showReload, setShowReload] = useState(false);
    const shownRef = useRef(false);

    useEffect(() => {
        if (Updates.isEnabled === false) return;

        let active = true;
        let lastCheckedAt = 0;
        let checking = false;

        const checkForUpdate = async (force: boolean): Promise<void> => {
            if (!active || checking || shownRef.current) return;
            if (!force && Date.now() - lastCheckedAt < CHECK_INTERVAL_MS) return;

            checking = true;
            lastCheckedAt = Date.now();
            try {
                const update = await Updates.checkForUpdateAsync();
                if (!active || !update.isAvailable) return;

                await Updates.fetchUpdateAsync();
                if (!active) return;
                shownRef.current = true;
                setShowReload(true);
            } catch (error) {
                // OTA が無効な開発ビルドなどでは取得できないが、起動は継続する
                console.debug("Update check failed:", error);
            } finally {
                checking = false;
            }
        };

        void checkForUpdate(true);
        const subscription = AppState.addEventListener("change", (state) => {
            if (state === "active") {
                void checkForUpdate(false);
            }
        });

        return (): void => {
            active = false;
            subscription.remove();
        };
    }, []);

    const reloadPageCallback = useCallback((): void => {
        shownRef.current = false;
        setShowReload(false);
        Updates.reloadAsync().catch(console.error);
    }, []);

    const dismissReloadCallback = useCallback((): void => {
        shownRef.current = false;
        setShowReload(false);
    }, []);

    return { reloadPageCallback, dismissReloadCallback, showReload };
};
//#endregion
