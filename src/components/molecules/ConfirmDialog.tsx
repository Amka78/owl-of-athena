//#region Import Modules
import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Dialog } from "react-native-paper";

import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import { ContentText, FlatButton } from "../atoms";
//#endregion

//#region Types
type ConfirmDialogSettings = {
    title: string;
    message: string;
    isCancelable?: boolean;
    onConfirm?: () => void;
    onDissmiss?: () => void;
};

type ConfirmDialogProps = {
    dialogContainer?: ViewStyle;
};
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
        let width = this.props.dialogContainer?.width;
        if (width && width > Dimens.inner_screen_max_width) {
            width = Dimens.inner_screen_max_width;
        } else if (width && typeof width === "number") {
            width = width - Dimens.content_margin_horizontal * 2;
        }
        return this.state.dialogSettings ? (
            <Dialog
                visible={true}
                onDismiss={async (): Promise<void> => {
                    this.closeDialog();
                }}
                style={[
                    style.dialogContainer,
                    this.props.dialogContainer,
                    { width },
                ]}
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
        alignSelf: "center",
        backgroundColor: Colors.navy_darker,
        marginLeft: Dimens.content_margin_horizontal,
        marginRight: Dimens.content_margin_horizontal,
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
