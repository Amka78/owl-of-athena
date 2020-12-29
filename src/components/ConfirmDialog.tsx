//#region Import Modules
import React from "react";
import { Message, Colors, Fonts, MessageKeys } from "../constants";
import { Dialog } from "react-native-paper";
import { FlatButton } from "./FlatButton";
import { ContentText } from "./ContentText";
import { StyleSheet } from "react-native";
//#endregion

//#region Types
type ConfirmDialogSettings = {
    title: string;
    message: string;
    isCancelable?: boolean;
    onConfirm?: () => void;
    onDissmiss?: () => void;
};

type ConfirmDialogProps = {};
type ConfirmDialogState = {
    dialogSettings?: ConfirmDialogSettings;
};
//#endregion

//#region Component
export class ConfirmDialog extends React.Component<
    ConfirmDialogProps,
    ConfirmDialogState
> {
    public static Instance?: ConfirmDialog;

    public static show(args: ConfirmDialogSettings): void {
        ConfirmDialog.Instance!.setState({ dialogSettings: args });
    }

    constructor(props: ConfirmDialogProps) {
        super(props);
        this.state = {
            dialogSettings: undefined,
        };
    }

    public async componentDidMount(): Promise<void> {
        ConfirmDialog.Instance = this;
    }

    private closeDialog(): void {
        if (this.state.dialogSettings!.onDissmiss) {
            this.state.dialogSettings!.onDissmiss();
        }
        this.setState({ dialogSettings: undefined });
    }

    public render(): JSX.Element | null {
        return this.state.dialogSettings ? (
            <Dialog
                visible={true}
                onDismiss={async (): Promise<void> => {
                    this.closeDialog();
                }}
                style={style.dialogContainer}
            >
                <Dialog.Title style={style.dialogTitle}>
                    {this.state.dialogSettings.title}
                </Dialog.Title>
                <Dialog.Content>
                    <ContentText>
                        {this.state.dialogSettings.message}
                    </ContentText>
                </Dialog.Content>
                <Dialog.Actions>
                    {this.state.dialogSettings.isCancelable === true ? (
                        <FlatButton
                            labelStyle={style.dialogButton}
                            onPress={this.onCancelPressed()}
                        >
                            {Message.get(MessageKeys.cancel)}
                        </FlatButton>
                    ) : undefined}
                    <FlatButton
                        labelStyle={style.dialogButton}
                        onPress={(): void => {
                            if (this.state.dialogSettings!.onConfirm) {
                                this.state.dialogSettings!.onConfirm();
                            }
                            this.setState({ dialogSettings: undefined });
                        }}
                    >
                        {Message.get(MessageKeys.ok)}
                    </FlatButton>
                </Dialog.Actions>
            </Dialog>
        ) : null;
    }

    private onCancelPressed(): () => void {
        return (): void => {
            this.closeDialog();
        };
    }
}
//#endregion

//#region Styles
const style = StyleSheet.create({
    dialogContainer: {
        backgroundColor: Colors.navy_darker,
    },
    dialogTitle: {
        color: Colors.cyan,
        fontFamily: Fonts.primarySemiBold,
    },
    dialogButton: {
        color: Colors.cyan,
    },
});
//#endregion
