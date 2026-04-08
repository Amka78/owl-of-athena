//#region Import Modules
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Dialog } from "react-native-paper";
import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import type { FileInfo } from "../../sdk/AuroraTypes";
import { useSessionTransferStore } from "../../store/sessionTransferStore";
import { ContentText, FlatButton } from "../atoms";

//#endregion

//#region Types
type SessionTransferDialogSettings = {
    isAuroraConnected: boolean;
    onTransferComplete?: () => void;
    onClose?: () => void;
};

type SessionTransferDialogState = {
    settings?: SessionTransferDialogSettings;
    selectedSessions: FileInfo[];
};
//#endregion

//#region Component
export class SessionTransferDialog extends React.Component<{}, SessionTransferDialogState> {
    public static Instance?: SessionTransferDialog;
    private _unsubscribe?: () => void;

    public static show(args: SessionTransferDialogSettings): void {
        SessionTransferDialog.Instance!.setState({ settings: args, selectedSessions: [] });
        if (args.isAuroraConnected) {
            useSessionTransferStore.getState().scanSessions();
        }
    }

    constructor(props: {}) {
        super(props);
        this.state = { settings: undefined, selectedSessions: [] };
    }

    public async componentDidMount(): Promise<void> {
        SessionTransferDialog.Instance = this;
        this._unsubscribe = useSessionTransferStore.subscribe((state) => {
            if (state.status === "idle" && state.unsyncedSessions.length > 0) {
                this.setState({ selectedSessions: state.unsyncedSessions });
            }
            if (state.status === "complete") {
                this.state.settings?.onTransferComplete?.();
            }
            this.forceUpdate();
        });
    }

    public componentWillUnmount(): void {
        this._unsubscribe?.();
    }

    private close(): void {
        const { settings } = this.state;
        useSessionTransferStore.getState().resetTransfer();
        settings?.onClose?.();
        this.setState({ settings: undefined, selectedSessions: [] });
    }

    private toggleSession(session: FileInfo): void {
        this.setState((state) => {
            const exists = state.selectedSessions.some((s) => s.file === session.file);
            return {
                selectedSessions: exists
                    ? state.selectedSessions.filter((s) => s.file !== session.file)
                    : [...state.selectedSessions, session],
            };
        });
    }

    public render(): React.ReactNode {
        if (!this.state.settings) return null;
        const store = useSessionTransferStore.getState();
        const { status, unsyncedSessions, transferredCount, statusText, error } = store;

        return (
            <Dialog visible={true} style={styles.dialog}>
                <Dialog.Title style={styles.title}>
                    {Message.get(MessageKeys.session_transfer_title)}
                </Dialog.Title>
                <Dialog.Content>{this.renderContent(status, unsyncedSessions, transferredCount, statusText, error)}</Dialog.Content>
                <Dialog.Actions>{this.renderActions(status, unsyncedSessions)}</Dialog.Actions>
            </Dialog>
        );
    }

    private renderContent(
        status: string,
        unsyncedSessions: FileInfo[],
        transferredCount: number,
        statusText: string,
        error?: string,
    ): React.ReactNode {
        if (!this.state.settings?.isAuroraConnected) {
            return <ContentText>{Message.get(MessageKeys.session_transfer_not_connected)}</ContentText>;
        }
        if (status === "scanning") {
            return (
                <View style={styles.centered}>
                    <ActivityIndicator color={Colors.cyan} />
                    <ContentText>{Message.get(MessageKeys.session_transfer_scanning)}</ContentText>
                </View>
            );
        }
        if (status === "error") {
            return <ContentText style={styles.errorText}>{error}</ContentText>;
        }
        if (status === "complete") {
            return (
                <ContentText style={styles.successText}>
                    {Message.get(MessageKeys.session_transfer_complete).replace("{0}", String(transferredCount))}
                </ContentText>
            );
        }
        if (status === "transferring") {
            return (
                <View style={styles.centered}>
                    <ActivityIndicator color={Colors.cyan} />
                    <ContentText>{statusText || Message.get(MessageKeys.session_transfer_transferring).replace("{0}", String(this.state.selectedSessions.length))}</ContentText>
                </View>
            );
        }
        if (unsyncedSessions.length === 0) {
            return <ContentText>{Message.get(MessageKeys.session_transfer_no_sessions)}</ContentText>;
        }

        return (
            <FlatList
                data={unsyncedSessions}
                keyExtractor={(item) => item.file}
                renderItem={({ item }) => {
                    const selected = this.state.selectedSessions.some((s) => s.file === item.file);
                    return (
                        <TouchableOpacity
                            style={[styles.sessionRow, selected && styles.sessionRowSelected]}
                            onPress={() => this.toggleSession(item)}
                        >
                            <ContentText style={styles.sessionName}>{item.name ?? item.file}</ContentText>
                            <ContentText style={styles.sessionSize}>{item.size ? `${Math.round(item.size / 1024)} KB` : ""}</ContentText>
                        </TouchableOpacity>
                    );
                }}
                style={styles.list}
            />
        );
    }

    private renderActions(status: string, unsyncedSessions: FileInfo[]): React.ReactNode {
        if (status === "scanning" || status === "transferring") return null;

        if (status === "complete" || status === "error" || !this.state.settings?.isAuroraConnected || unsyncedSessions.length === 0) {
            return (
                <FlatButton labelStyle={styles.primaryButton} onPress={() => this.close()}>
                    {Message.get(MessageKeys.session_transfer_continue)}
                </FlatButton>
            );
        }

        const count = this.state.selectedSessions.length;
        return (
            <>
                <FlatButton labelStyle={styles.secondaryButton} onPress={() => this.close()}>
                    {Message.get(MessageKeys.session_transfer_cancel)}
                </FlatButton>
                <FlatButton
                    labelStyle={styles.primaryButton}
                    disabled={count === 0}
                    onPress={() =>
                        useSessionTransferStore.getState().transferSessions(this.state.selectedSessions)
                    }
                >
                    {Message.get(MessageKeys.session_transfer_button).replace("{0}", String(count))}
                </FlatButton>
            </>
        );
    }
}
//#endregion

//#region Styles
const styles = StyleSheet.create({
    dialog: {
        alignSelf: "center",
        backgroundColor: Colors.navy_darker,
        maxWidth: Dimens.inner_screen_max_width,
        width: "90%",
        maxHeight: "80%",
    },
    title: { color: Colors.cyan, fontFamily: Fonts.primarySemiBold },
    centered: { alignItems: "center", padding: 16, gap: 8 },
    list: { maxHeight: 300 },
    sessionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.blue,
    },
    sessionRowSelected: { backgroundColor: `${Colors.cyan}22` },
    sessionName: { flex: 1 },
    sessionSize: { color: Colors.first_accent_color, fontSize: 12 },
    primaryButton: { color: Colors.cyan },
    secondaryButton: { color: Colors.white },
    successText: { color: Colors.first_accent_color, textAlign: "center" },
    errorText: { color: "#ff4310" },
});
//#endregion
