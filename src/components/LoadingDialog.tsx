import React, { FunctionComponent } from "react";
import { Message, Colors, Fonts } from "../constants";
import { MessageLocalizationParam } from "../constants/Message";
import { Dialog, ActivityIndicator } from "react-native-paper";
type LoadingDialogProps = {
    visible: boolean;
    onDissmiss?: () => void;
    dialogTitle: MessageLocalizationParam;
};

export const LoadingDialog: FunctionComponent<LoadingDialogProps> = (
    props: LoadingDialogProps
) => {
    return (
        <Dialog
            visible={props.visible}
            onDismiss={async (): Promise<void> => {
                if (props.onDissmiss) {
                    props.onDissmiss();
                }
            }}
            style={{
                alignSelf: "center",
                backgroundColor: Colors.navy_darker
            }}
        >
            <Dialog.Title
                style={{
                    color: Colors.cyan,
                    fontFamily: Fonts.primarySemiBold
                }}
            >
                {Message.get(
                    props.dialogTitle.key,
                    props.dialogTitle.restParam
                )}
            </Dialog.Title>
            <Dialog.Content>
                <ActivityIndicator></ActivityIndicator>
            </Dialog.Content>
        </Dialog>
    );
};
