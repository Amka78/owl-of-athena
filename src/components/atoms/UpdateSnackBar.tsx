//#region Import modules
import React, { FunctionComponent } from "react";
import { Snackbar } from "react-native-paper";

import { Message, MessageKeys } from "../../constants";
import { useAppUpdate } from "../../hooks";
//#endregion

//#region Types
export type UpdateSnackBarProps = {
    showReload: boolean;
    reloadPageCallback?: () => void;
};
//#endregion

//#region Components
export const UpdateSnackBarCore: FunctionComponent<UpdateSnackBarProps> = (
    props: UpdateSnackBarProps
) => {
    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        <Snackbar
            visible={props.showReload}
            onDismiss={props.reloadPageCallback}
            action={{
                label: Message.get(MessageKeys.update_snack_bar_action_label),
                onPress: props.reloadPageCallback,
            }}
        >
            {Message.get(MessageKeys.update_snack_bar_title)}
        </Snackbar>
    );
};

export const UpdateSnackBar: FunctionComponent = () => {
    const appUpdateHook = useAppUpdate();
    return <UpdateSnackBarCore {...appUpdateHook}></UpdateSnackBarCore>;
};
//#endregion
