import React, { useEffect, FunctionComponent } from "react";
import { Snackbar } from "react-native-paper";
import { Message, MessageKeys } from "../constants";

export const UpdateSnackBar: FunctionComponent = () => {
    const [showReload, setShowReload] = React.useState(false);
    const [
        waitingWorker,
        setWaitingWorker,
    ] = React.useState<ServiceWorker | null>(null);

    const onSWUpdate = (registration: ServiceWorkerRegistration): void => {
        setShowReload(true);
        setWaitingWorker(registration.waiting);
    };

    useEffect(() => {
        // @ts-ignore
        navigator.serviceWorker.register({ onUpdate: onSWUpdate });
    }, []);

    const reloadPage = (): void => {
        // @ts-ignore
        waitingWorker!.postMessage({ type: "SKIP_WAITING" });
        setShowReload(false);
        // @ts-ignore
        window.location.reload(true);
    };

    return (
        <Snackbar
            visible={showReload}
            onDismiss={reloadPage}
            action={{
                label: Message.get(MessageKeys.update_snack_bar_action_label),
                onPress: reloadPage,
            }}
        >
            {Message.get(MessageKeys.update_snack_bar_title)}
        </Snackbar>
    );
};
