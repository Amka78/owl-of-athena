//#region Import Modules
import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import { ProgressBar } from "react-native-paper";
import { Colors, Dimens, Fonts } from "../../constants";

//#endregion

//#region Types
type LoadingDialogState = {
    settings?: LoadingDialogSettings;
};

type LoadingDialogSettings = {
    onDissmiss?: () => void;
    dialogTitle: string;
    /** 0〜1。指定時は不定プログレスではなく進捗バーを表示する。 */
    progress?: number;
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
                        <View style={styles.dialogContainer}>
                            <Text style={styles.dialogTitle}>{settings.dialogTitle}</Text>
                            <View style={styles.dialogBody}>
                                {settings.progress === undefined ? (
                                    // paper の ActivityIndicator は二重円（2 本の回転アーク）を
                                    // 描画するため、単一スピナーに見えない。RN コアの
                                    // ActivityIndicator（Android ではネイティブ ProgressBar）を使う。
                                    <ActivityIndicator color={Colors.cyan} size={48} />
                                ) : (
                                    <>
                                        <ProgressBar
                                            progress={Math.max(0, Math.min(1, settings.progress))}
                                            color={Colors.cyan}
                                            style={styles.progress}
                                        />
                                        <Text style={styles.progressText}>
                                            {Math.round(
                                                Math.max(0, Math.min(1, settings.progress)) * 100,
                                            )}
                                            %
                                        </Text>
                                    </>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    /** 進行中の処理を戻るキーで中断させない。 */
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
    dialogContainer: {
        backgroundColor: Colors.navy_darker,
        borderRadius: 4,
        maxWidth: Dimens.inner_screen_max_width,
        minHeight: 176,
        paddingBottom: 32,
        paddingHorizontal: 24,
        paddingTop: 28,
        width: "90%",
    },
    dialogTitle: {
        color: Colors.cyan,
        fontFamily: Fonts.primarySemiBold,
        fontSize: 22,
        marginBottom: 16,
        textAlign: "center",
    },
    dialogBody: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    progress: { marginTop: 4, width: "100%" },
    progressText: { color: Colors.white, fontSize: 12, marginTop: 8, textAlign: "center" },
});
//#endregion
