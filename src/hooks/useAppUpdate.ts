//#region Import Modules
import { useCallback, useEffect, useRef, useState } from "react";
//#endregion

//#region Hooks
export const useAppUpdate = (): {
    reloadPageCallback: () => void;
    dismissReloadCallback: () => void;
    showReload: boolean;
} => {
    const [showReload, setShowReload] = useState(false);
    const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        if (!("serviceWorker" in navigator)) return;

        let active = true;
        navigator.serviceWorker
            .register("/expo-service-worker.js", {
                scope: "/",
            })
            .then((registration: ServiceWorkerRegistration) => {
                if (!active) return;
                registrationRef.current = registration;

                if (registration.waiting && navigator.serviceWorker.controller) {
                    setShowReload(true);
                }

                registration.onupdatefound = (): void => {
                    const worker = registration.installing;
                    if (!worker) return;

                    worker.onstatechange = (): void => {
                        if (
                            active &&
                            worker.state === "installed" &&
                            navigator.serviceWorker.controller
                        ) {
                            setShowReload(true);
                        }
                    };
                };
            })
            .catch((error: any) => {
                console.error(error);
            });

        return (): void => {
            active = false;
        };
    }, []);

    const reloadPageCallback = useCallback((): void => {
        registrationRef.current?.waiting?.postMessage({ type: "SKIP_WAITING" });
        setShowReload(false);
        window.location.reload();
    }, []);

    const dismissReloadCallback = useCallback((): void => {
        setShowReload(false);
    }, []);

    return { reloadPageCallback, dismissReloadCallback, showReload };
};
//#endregion
