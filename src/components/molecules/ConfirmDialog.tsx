//#region Import Modules
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";

import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import { ContentText, FlatButton } from "../ui";

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
export class ConfirmDialog extends React.Component<ConfirmDialogProps, ConfirmDialogState> {
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

    public render(): React.ReactNode {
        const settings = this.state.dialogSettings;
        if (!settings) return null;

        let width = this.props.dialogContainer?.width;
        if (typeof width === "number") {
            width =
                width > Dimens.inner_screen_max_width
                    ? Dimens.inner_screen_max_width
                    : width - Dimens.content_margin_horizontal * 2;
        }

        return (
            // paper の Dialog（Modal）はこの環境（RN 0.88 + ナビゲータ配下）で背面レイヤーが
            // 画面全域を覆えず、スクリムが上半分のみ・中央ずれになる（2026-11-16 実測）。
            // ネイティブの <Modal> は常に全画面ウィンドウとして描画されるため、
            // スクリム・中央配置・コンテンツ寸法を確実に担保できる。
            <Modal
                visible={true}
                transparent={true}
                animationType="fade"
                onRequestClose={this.onRequestClose()}
            >
                <Pressable
                    style={style.backdrop}
                    onPress={settings.isCancelable === true ? this.onClosePressed() : undefined}
                    accessibilityRole="button"
                    accessibilityLabel={Message.get(MessageKeys.cancel)}
                >
                    <View style={style.centerBox}>
                        <View
                            style={[
                                style.dialogContainer,
                                typeof width === "number" ? { width } : undefined,
                                this.props.dialogContainer,
                            ]}
                        >
                            <Text style={style.dialogTitle}>{settings.title}</Text>
                            <View style={style.dialogBody}>
                                {/* ContentText の既定 flex:1 はダイアログ本文が余白を吸って伸びるため無効化する */}
                                <ContentText style={style.dialogMessage}>
                                    {settings.message}
                                </ContentText>
                            </View>
                            <View style={style.dialogActions}>
                                {settings.isCancelable === true ? (
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
                                        if (settings.onConfirm) {
                                            settings.onConfirm();
                                        }
                                        this.setState({ dialogSettings: undefined });
                                    }}
                                >
                                    {Message.get(MessageKeys.ok)}
                                </FlatButton>
                            </View>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        );
    }

    private onClosePressed(): () => void {
        return (): void => {
            this.closeDialog();
        };
    }

    /** Android の戻るキー。isCancelable でないダイアログは戻るキーでも閉じない。 */
    private onRequestClose(): () => void {
        return (): void => {
            if (this.state.dialogSettings?.isCancelable === true) {
                this.closeDialog();
            }
        };
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
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    centerBox: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: Dimens.content_margin_horizontal,
    },
    dialogContainer: {
        backgroundColor: Colors.navy_darker,
        borderRadius: 4,
        maxWidth: Dimens.inner_screen_max_width,
        paddingBottom: 8,
        paddingHorizontal: 24,
        paddingTop: 20,
        width: "90%",
    },
    dialogTitle: {
        color: Colors.cyan,
        fontFamily: Fonts.primarySemiBold,
        fontSize: 22,
        marginBottom: 12,
    },
    dialogBody: {
        paddingBottom: 16,
    },
    dialogMessage: {
        flex: 0,
    },
    dialogActions: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    dialogButton: {
        color: Colors.cyan,
    },
});
//#endregion
