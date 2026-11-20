//#region Import Modules
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import { ContentText, FlatButton } from "../atoms";

//#endregion

//#region Types
type SessionTransferDialogSettings = {
    unsyncedCount: number;
    onConfirm?: () => void;
    onClose?: () => void;
};

type SessionTransferDialogState = {
    settings?: SessionTransferDialogSettings;
};
//#endregion

//#region Component
/**
 * 未同期セッションの同期確認ダイアログ。
 * iOS 版（StatsController の "You have %i unsynced sessions. Sync now?"）と同じく、
 * セッション一覧での選択は行わず、確認後に全件一括で同期する。
 */
export class SessionTransferDialog extends React.Component<{}, SessionTransferDialogState> {
    public static Instance?: SessionTransferDialog;

    public static show(args: SessionTransferDialogSettings): void {
        SessionTransferDialog.Instance!.setState({ settings: args });
    }

    constructor(props: {}) {
        super(props);
        this.state = { settings: undefined };
    }

    public componentDidMount(): void {
        SessionTransferDialog.Instance = this;
    }

    private close(onClose?: () => void): void {
        onClose?.();
        this.setState({ settings: undefined });
    }

    public render(): React.ReactNode {
        const settings = this.state.settings;
        if (!settings) return null;

        return (
            // paper の Dialog（Modal）はこの環境（RN 0.88 + ナビゲータ配下）で背面レイヤーが
            // 画面全域を覆えず、スクリムが上半分のみ・中央ずれになる（2026-11-16 ConfirmDialog で実測）。
            // ネイティブの <Modal> は常に全画面ウィンドウとして描画されるため、
            // スクリム・中央配置・コンテンツ寸法を確実に担保できる。
            <Modal
                visible={true}
                transparent={true}
                animationType="fade"
                onRequestClose={this.onRequestClose()}
            >
                <View style={styles.backdrop}>
                    <View style={styles.centerBox}>
                        <View style={styles.dialog}>
                            <Text style={styles.title}>
                                {Message.get(MessageKeys.session_transfer_title)}
                            </Text>
                            <View style={styles.content}>
                                <ContentText style={styles.message}>
                                    {Message.get(MessageKeys.session_transfer_confirm_message, [
                                        String(settings.unsyncedCount),
                                    ])}
                                </ContentText>
                            </View>
                            <View style={styles.actions}>
                                <FlatButton
                                    labelStyle={styles.secondaryButton}
                                    onPress={(): void => this.close(settings.onClose)}
                                >
                                    {Message.get(MessageKeys.session_transfer_cancel)}
                                </FlatButton>
                                <FlatButton
                                    labelStyle={styles.primaryButton}
                                    onPress={(): void => this.close(settings.onConfirm)}
                                >
                                    {Message.get(MessageKeys.session_transfer_sync)}
                                </FlatButton>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    /** 同期の確認前に戻るキーでダイアログを閉じさせない（paper の Dialog と同等の挙動）。 */
    private onRequestClose(): () => void {
        return (): void => {
            // no-op
        };
    }
}
//#endregion

//#region Styles
const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        flex: 1,
    },
    centerBox: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: Dimens.content_margin_horizontal,
    },
    dialog: {
        backgroundColor: Colors.navy_darker,
        borderRadius: 4,
        maxWidth: Dimens.inner_screen_max_width,
        paddingBottom: 8,
        paddingHorizontal: 24,
        paddingTop: 20,
        width: "90%",
    },
    title: {
        color: Colors.cyan,
        fontFamily: Fonts.primarySemiBold,
        fontSize: 22,
        marginBottom: 16,
    },
    content: {
        paddingBottom: 16,
    },
    message: {
        flex: 0,
    },
    actions: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    primaryButton: { color: Colors.cyan },
    secondaryButton: { color: Colors.white },
});
//#endregion
