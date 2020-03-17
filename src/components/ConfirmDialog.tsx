import React from "react";
import { Message, Colors, Fonts, MessageKeys } from "../constants";
import { MessageLocalizationParam } from "../constants/Message";
import { Dialog } from "react-native-paper";
import { FlatButton } from "./FlatButton";
import { ContentText } from "./ContentText";
import { StyleSheet } from "react-native";
type ConfirmDialogSettings = {
    title: MessageLocalizationParam;
    message: MessageLocalizationParam;
    isCancelable?: boolean;
    onConfirm?: () => void;
    onDissmiss?: () => void;
};

type ConfirmDialogProps = {};
type ConfirmDialogState = {
    dialogSettings?: ConfirmDialogSettings;
};

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
            dialogSettings: undefined
        };
    }

    public async componentDidMount(): Promise<void> {
        ConfirmDialog.Instance = this;
    }

    private closeDialog(): void {
        if (this.state.dialogSettings!.onDissmiss) {
            this.state.dialogSettings!.onDissmiss();
        }
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
                    {Message.get(
                        this.state.dialogSettings.title.key,
                        this.state.dialogSettings.title.restParam
                    )}
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
                            {{ key: MessageKeys.cancel }}
                        </FlatButton>
                    ) : (
                        undefined
                    )}
                    <FlatButton
                        labelStyle={style.dialogButton}
                        onPress={(): void => {
                            if (this.state.dialogSettings!.onConfirm) {
                                this.state.dialogSettings!.onConfirm();
                            }
                            this.setState({ dialogSettings: undefined });
                        }}
                    >
                        {{ key: "ok" }}
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

const style = StyleSheet.create({
    dialogContainer: {
        backgroundColor: Colors.navy_darker
    },
    dialogTitle: {
        color: Colors.cyan,
        fontFamily: Fonts.primarySemiBold
    },
    dialogButton: {
        color: Colors.cyan
    }
});
