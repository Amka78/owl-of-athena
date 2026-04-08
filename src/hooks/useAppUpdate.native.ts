//#region Import Modules

import * as Updates from "expo-updates";
import { useCallback, useEffect, useState } from "react";
//#endregion

//#region Hooks
export const useAppUpdate = (): {
    reloadPageCallback: () => void;
    showReload: boolean;
} => {
    const [showReload, setShowReload] = useState(false);

    useEffect(() => {
        const checkForUpdate = async (): Promise<void> => {
            try {
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    await Updates.fetchUpdateAsync();
                    setShowReload(true);
                }
            } catch (error) {
                console.debug("Update check failed:", error);
            }
        };
        checkForUpdate();
    }, []);

    const reloadPageCallback = useCallback((): void => {
        setShowReload(false);
        Updates.reloadAsync().catch(console.error);
    }, []);

    return { reloadPageCallback, showReload };
};
//#endregion
