//#region Import Modules
import React from "react";
import { StyleSheet } from "react-native";
import { ActivityIndicator, Dialog } from "react-native-paper";
import { Colors, Fonts } from "../../constants";

//#endregion

//#region Types
type LoadingDialogState = {
    settings?: LoadingDialogSettings;
};

type LoadingDialogSettings = {
    onDissmiss?: () => void;
    dialogTitle: string;
};

type LoadingDialogProps = {};
//#endregion

//#region Component
export class LoadingDialog extends React.Component<LoadingDialogProps, LoadingDialogState> {
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
            settings: undefined,
        };
    }

    public async componentDidMount(): Promise<void> {
        LoadingDialog.Instance = this;
    }

    public render(): React.ReactNode {
        return this.state.settings ? (
            <Dialog visible={true} style={styles.dialogContainer}>
                <Dialog.Title style={styles.dialogTitle}>
                    {this.state.settings.dialogTitle}
                </Dialog.Title>
                <Dialog.Content>
                    <ActivityIndicator></ActivityIndicator>
                </Dialog.Content>
            </Dialog>
        ) : null;
    }
}
//#endregion

//#region Styles
const styles = StyleSheet.create({
    dialogContainer: {
        alignSelf: "center",
        backgroundColor: Colors.navy_darker,
    },
    dialogTitle: {
        color: Colors.cyan,
        fontFamily: Fonts.primarySemiBold,
    },
});
//#endregion
