//#region Import Modules
import React from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { Dialog } from "react-native-paper";
import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import IssueService from "../../services/IssueService";
import type { IssueAttachmentWithUrl } from "../../types";
import { FlatButton } from "../atoms";

//#endregion

//#region Types
type IssueLogDialogSettings = {
    title?: string;
    logs: string;
    issueId?: string;
};

type IssueLogDialogState = {
    settings?: IssueLogDialogSettings;
    attachments: IssueAttachmentWithUrl[];
    loadingAttachments: boolean;
};
//#endregion

//#region Component
export class IssueLogDialog extends React.Component<{}, IssueLogDialogState> {
    public static Instance?: IssueLogDialog;
    private attachmentRequest?: string;

    public static show(args: IssueLogDialogSettings): void {
        IssueLogDialog.Instance?.open(args);
    }

    constructor(props: {}) {
        super(props);
        this.state = { settings: undefined, attachments: [], loadingAttachments: false };
    }

    public componentDidMount(): void {
        IssueLogDialog.Instance = this;
    }

    public componentWillUnmount(): void {
        if (IssueLogDialog.Instance === this) {
            IssueLogDialog.Instance = undefined;
        }
    }

    private open(args: IssueLogDialogSettings): void {
        this.attachmentRequest = args.issueId;
        this.setState({
            settings: args,
            attachments: [],
            loadingAttachments: args.issueId !== undefined,
        });
        if (args.issueId) {
            void this.loadAttachments(args.issueId);
        }
    }

    private async loadAttachments(issueId: string): Promise<void> {
        try {
            const attachments = await IssueService.getAttachments(issueId);
            if (this.attachmentRequest === issueId) {
                this.setState({ attachments, loadingAttachments: false });
            }
        } catch (error) {
            console.debug("Failed to load issue attachments:", error);
            if (this.attachmentRequest === issueId) {
                this.setState({ loadingAttachments: false });
            }
        }
    }

    private close(): void {
        this.attachmentRequest = undefined;
        this.setState({ settings: undefined, attachments: [], loadingAttachments: false });
    }

    public render(): React.ReactNode {
        const { settings } = this.state;
        if (!settings) return null;

        return (
            <Dialog visible={true} onDismiss={() => this.close()} style={styles.dialog}>
                <Dialog.Title style={styles.title}>
                    {settings.title || Message.get(MessageKeys.admin_issue_logs_title)}
                </Dialog.Title>
                <Dialog.ScrollArea style={styles.scrollArea}>
                    <ScrollView contentContainerStyle={styles.content}>
                        {settings.logs ? (
                            <Text selectable style={styles.logs}>
                                {settings.logs}
                            </Text>
                        ) : null}
                        {this.state.loadingAttachments ? (
                            <Text style={styles.attachmentHint}>Loading...</Text>
                        ) : null}
                        {this.state.attachments.length > 0 ? (
                            <View style={styles.attachments}>
                                <Text style={styles.attachmentTitle}>
                                    {Message.get(MessageKeys.admin_issue_attachments_title)}
                                </Text>
                                {this.state.attachments.map((attachment) => (
                                    <FlatButton
                                        key={attachment.id}
                                        disabled={attachment.url === undefined}
                                        labelStyle={styles.attachmentButton}
                                        onPress={() => {
                                            if (attachment.url) {
                                                void Linking.openURL(attachment.url);
                                            }
                                        }}
                                    >
                                        {attachment.file_name}
                                    </FlatButton>
                                ))}
                            </View>
                        ) : null}
                    </ScrollView>
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <FlatButton labelStyle={styles.button} onPress={() => this.close()}>
                        {Message.get(MessageKeys.ok)}
                    </FlatButton>
                </Dialog.Actions>
            </Dialog>
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
    },
    title: { color: Colors.cyan, fontFamily: Fonts.primarySemiBold },
    scrollArea: { maxHeight: 400, paddingHorizontal: 0 },
    content: { padding: 12 },
    logs: {
        color: Colors.white,
        fontFamily: "monospace",
        fontSize: 11,
    },
    attachments: { marginTop: 12 },
    attachmentTitle: { color: Colors.cyan, fontSize: 12, fontWeight: "bold" },
    attachmentButton: { color: Colors.white, textAlign: "left" },
    attachmentHint: { color: Colors.white, fontSize: 11, opacity: 0.7 },
    button: { color: Colors.cyan },
});
//#endregion
