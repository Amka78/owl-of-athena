//#region Import modules
import React, { useEffect, FunctionComponent } from "react";
import { Snackbar } from "react-native-paper";
import { Message, MessageKeys } from "../constants";
//#endregion

//#region Export functions
export const UpdateSnackBar: FunctionComponent = () => {
    //#region useState
    const [showReload, setShowReload] = React.useState(false);
    const [
        waitingWorker,
        setWaitingWorker,
    ] = React.useState<ServiceWorker | null>(null);
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

    const reloadPageCallback = (): void => {
        waitingWorker?.postMessage({ type: "SKIP_WAITING" });
        setShowReload(false);
        window.location.reload(true);
    };

    //#region components
    return (
        <Snackbar
            visible={showReload}
            onDismiss={reloadPageCallback}
            action={{
                label: Message.get(MessageKeys.update_snack_bar_action_label),
                onPress: reloadPageCallback,
            }}
        >
            {Message.get(MessageKeys.update_snack_bar_title)}
        </Snackbar>
    );
    //#endregion
};
//#endregion
