import React from "react";
import { Message, Colors, Fonts } from "../constants";
import { MessageLocalizationParam } from "../constants/Message";
import { Dialog, ActivityIndicator } from "react-native-paper";
import { StyleSheet } from "react-native";

type LoadingDialogState = {
    settings?: LoadingDialogSettings;
};

type LoadingDialogSettings = {
    onDissmiss?: () => void;
    dialogTitle: MessageLocalizationParam;
};

type LoadingDialogProps = {};

export class LoadingDialog extends React.Component<
    LoadingDialogProps,
    LoadingDialogState
> {
    public static Instance?: LoadingDialog;

    public static show(args: LoadingDialogSettings): void {
        LoadingDialog.Instance!.setState({ settings: args });
    }

    public static close(): void {
        LoadingDialog.Instance!.setState({ settings: undefined });
    }

    constructor(props: LoadingDialogProps) {
        super(props);
        this.state = {
            settings: undefined
        };
    }

    public async componentDidMount(): Promise<void> {
        LoadingDialog.Instance = this;
    }

    public render(): JSX.Element | null {
        return this.state.settings ? (
            <Dialog visible={true} style={style.dialogContainer}>
                <Dialog.Title style={style.dialogTitle}>
                    {Message.get(
                        this.state.settings!.dialogTitle.key,
                        this.state.settings!.dialogTitle.restParam
                    )}
                </Dialog.Title>
                <Dialog.Content>
                    <ActivityIndicator></ActivityIndicator>
                </Dialog.Content>
            </Dialog>
        ) : null;
    }
}

const style = StyleSheet.create({
    dialogContainer: {
        alignSelf: "center",
        backgroundColor: Colors.navy_darker
    },
    dialogTitle: {
        color: Colors.cyan,
        fontFamily: Fonts.primarySemiBold
    }
});
