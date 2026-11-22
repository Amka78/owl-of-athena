//#region Import Modules
import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import { ProgressBar } from "react-native-paper";
import { Colors, Dimens, Fonts } from "../../constants";
import type { AuroraCommLogEntry } from "../../services/AuroraCommLog";
import * as AuroraCommLog from "../../services/AuroraCommLog";
import { AuroraCommLogPanel } from "./AuroraCommLogPanel";

//#endregion

//#region Types
type LoadingDialogState = {
    settings?: LoadingDialogSettings;
    commEntries: readonly AuroraCommLogEntry[];
};

type LoadingDialogSettings = {
    onDissmiss?: () => void;
    dialogTitle: string;
    /** 0〜1。指定時は不定プログレスではなく進捗バーを表示する。 */
    progress?: number;
    /**
     * true にするとスピナーの代わりに Aurora との通信履歴
     * （送信コマンド / 応答 / 接続状態）を表示する。
     */
    auroraCommLog?: boolean;
};

type LoadingDialogProps = {};

/** スピナー表示（非通信モード）の検証用。 */
const TEST_ID_LOADING_INDICATOR = "loading-indicator";
//#endregion

//#region Component
export class LoadingDialog extends React.Component<LoadingDialogProps, LoadingDialogState> {
    public static Instance?: LoadingDialog;

    public static show(args: LoadingDialogSettings): void {
        // 通信ログが既に開いているダイアログの進捗更新（= 同じ呼び出し元の再 show）では
        // 途中で履歴が消えないよう、開き直しのときだけ clear する。
        const previous = LoadingDialog.Instance?.state.settings;
        if (args.auroraCommLog === true && previous?.auroraCommLog !== true) {
            AuroraCommLog.clear();
        }
        LoadingDialog.Instance!.setState({ settings: args });
    }

    public static close(): void {
        LoadingDialog.Instance!.setState({ settings: undefined });
    }

    constructor(props: LoadingDialogProps) {
        super(props);
        this.state = {
            settings: undefined,
            commEntries: [],
        };
    }

    public componentDidMount(): void {
        LoadingDialog.Instance = this;
        this.unsubscribeCommLog = AuroraCommLog.subscribe((commEntries) => {
            this.setState({ commEntries });
        });
    }

    public componentWillUnmount(): void {
        this.unsubscribeCommLog?.();
        if (LoadingDialog.Instance === this) {
            LoadingDialog.Instance = undefined;
        }
    }

    private unsubscribeCommLog?: () => void;

    public render(): React.ReactNode {
        const settings = this.state.settings;
        if (!settings) return null;

        const progressView =
            settings.progress !== undefined ? (
                <>
                    <ProgressBar
                        progress={Math.max(0, Math.min(1, settings.progress))}
                        color={Colors.cyan}
                        style={styles.progress}
                    />
                    <Text style={styles.progressText}>
                        {Math.round(Math.max(0, Math.min(1, settings.progress)) * 100)}%
                    </Text>
                </>
            ) : null;

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
                        <View
                            style={[
                                styles.dialogContainer,
                                settings.auroraCommLog && styles.dialogContainerLog,
                            ]}
                        >
                            <Text style={styles.dialogTitle}>{settings.dialogTitle}</Text>
                            <View
                                style={[
                                    styles.dialogBody,
                                    settings.auroraCommLog && styles.dialogBodyLog,
                                ]}
                            >
                                {settings.auroraCommLog ? (
                                    <>
                                        <AuroraCommLogPanel entries={this.state.commEntries} />
                                        {progressView}
                                    </>
                                ) : settings.progress === undefined ? (
                                    // paper の ActivityIndicator は二重円（2 本の回転アーク）を
                                    // 描画するため、単一スピナーに見えない。RN コアの
                                    // ActivityIndicator（Android ではネイティブ ProgressBar）を使う。
                                    <ActivityIndicator
                                        testID={TEST_ID_LOADING_INDICATOR}
                                        color={Colors.cyan}
                                        size={48}
                                    />
                                ) : (
                                    progressView
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
    // 通信ログ表示時はパネルが入るよう背を高くする。
    dialogContainerLog: {
        minHeight: 320,
    },
    dialogBody: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    // 通信ログ表示時はログを上寄せで敷き詰める。
    dialogBodyLog: {
        alignItems: "stretch",
        justifyContent: "flex-start",
    },
    progress: { marginTop: 4, width: "100%" },
    progressText: { color: Colors.white, fontSize: 12, marginTop: 8, textAlign: "center" },
});
//#endregion
