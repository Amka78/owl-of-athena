//#region Import Modules
import React, { useCallback, useEffect, useState } from "react";
//#endregion

//#region Hooks
export const useAppUpdate = (): {
    reloadPageCallback: () => void;
    showReload: boolean;
} => {
    //#region useState
    const [showReload, setShowReload] = React.useState(false);
    const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
        null
    );
    //#endregion

    //#region useEffect
    useEffect(() => {
        navigator?.serviceWorker
            ?.register("/expo-service-worker.js", {
                scope: "/",
            })
            .then((registration: ServiceWorkerRegistration) => {
                registration.onupdatefound = (): void => {
                    setShowReload(true);
                    setWaitingWorker(registration.waiting);
                };
                console.debug(registration);
            })
            .catch((error: any) => {
                console.error(error);
            });
    }, []);
    //#endregion

    const reloadPageCallback = useCallback((): void => {
        waitingWorker?.postMessage({ type: "SKIP_WAITING" });
        setShowReload(false);
        window.location.reload(true);
    }, [waitingWorker]);
    return { reloadPageCallback, showReload };
};
//#endregion
