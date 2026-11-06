//#region Import Modules
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Checkbox, Dialog } from "react-native-paper";
import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import {
    isAttachmentSizeAllowed,
    MAX_ISSUE_ATTACHMENTS,
} from "../../services/IssueAttachmentModel";
import LogService from "../../services/LogService";
import { useIssueStore } from "../../store/issueStore";
import type { IssueAttachmentInput } from "../../types";
import { ContentText, FlatButton } from "../atoms";
import { ValidatableTextBox } from "./ValidatableTextBox";

//#endregion

//#region Types
type IssueReportDialogSettings = {
    onClose?: () => void;
};

type IssueReportDialogState = {
    settings?: IssueReportDialogSettings;
    title: string;
    description: string;
    reproduce_steps: string;
    critical: boolean;
    anonymous: boolean;
    attachLogs: boolean;
    attachments: IssueAttachmentInput[];
    attachmentError?: string;
};
//#endregion

//#region Component
export class IssueReportDialog extends React.Component<{}, IssueReportDialogState> {
    public static Instance?: IssueReportDialog;

    public static show(args: IssueReportDialogSettings = {}): void {
        IssueReportDialog.Instance!.setState({
            settings: args,
            attachments: [],
            attachmentError: undefined,
        });
    }

    constructor(props: {}) {
        super(props);
        this.state = {
            settings: undefined,
            title: "",
            description: "",
            reproduce_steps: "",
            critical: false,
            anonymous: false,
            attachLogs: true,
            attachments: [],
            attachmentError: undefined,
        };
    }

    public async componentDidMount(): Promise<void> {
        IssueReportDialog.Instance = this;
    }

    private close(): void {
        if (this.state.settings?.onClose) this.state.settings.onClose();
        this.setState({
            settings: undefined,
            title: "",
            description: "",
            reproduce_steps: "",
            critical: false,
            anonymous: false,
            attachLogs: true,
            attachments: [],
            attachmentError: undefined,
        });
        useIssueStore.getState().reset();
    }

    public render(): React.ReactNode {
        if (!this.state.settings) return null;

        const { loading, success, error } = useIssueStore.getState();

        return (
            <Dialog visible={true} onDismiss={() => this.close()} style={styles.dialog}>
                <Dialog.Title style={styles.title}>
                    {Message.get(MessageKeys.issue_report_title)}
                </Dialog.Title>
                <Dialog.ScrollArea>
                    <ScrollView>
                        <View style={styles.content}>
                            {success ? (
                                <ContentText style={styles.successText}>
                                    {Message.get(MessageKeys.issue_report_success)}
                                </ContentText>
                            ) : (
                                <>
                                    <ValidatableTextBox
                                        label={Message.get(MessageKeys.issue_report_input_title)}
                                        value={this.state.title}
                                        onChangeText={(t) => this.setState({ title: t })}
                                        style={styles.input}
                                    />
                                    <ValidatableTextBox
                                        label={Message.get(
                                            MessageKeys.issue_report_input_description,
                                        )}
                                        value={this.state.description}
                                        onChangeText={(t) => this.setState({ description: t })}
                                        multiline
                                        numberOfLines={3}
                                        style={styles.input}
                                    />
                                    <ValidatableTextBox
                                        label={Message.get(
                                            MessageKeys.issue_report_input_reproduce_steps,
                                        )}
                                        value={this.state.reproduce_steps}
                                        onChangeText={(t) => this.setState({ reproduce_steps: t })}
                                        multiline
                                        numberOfLines={3}
                                        style={styles.input}
                                    />
                                    <View style={styles.checkRow}>
                                        <Checkbox.Item
                                            label={Message.get(
                                                MessageKeys.issue_report_check_critical,
                                            )}
                                            status={this.state.critical ? "checked" : "unchecked"}
                                            onPress={() =>
                                                this.setState((s) => ({ critical: !s.critical }))
                                            }
                                            color={Colors.cyan}
                                            labelStyle={styles.checkLabel}
                                        />
                                        <Checkbox.Item
                                            label={Message.get(
                                                MessageKeys.issue_report_check_anonymous,
                                            )}
                                            status={this.state.anonymous ? "checked" : "unchecked"}
                                            onPress={() =>
                                                this.setState((s) => ({ anonymous: !s.anonymous }))
                                            }
                                            color={Colors.cyan}
                                            labelStyle={styles.checkLabel}
                                        />
                                    </View>
                                    <Checkbox.Item
                                        label={Message.get(
                                            MessageKeys.issue_report_check_attach_logs,
                                        )}
                                        status={this.state.attachLogs ? "checked" : "unchecked"}
                                        onPress={() =>
                                            this.setState((s) => ({ attachLogs: !s.attachLogs }))
                                        }
                                        color={Colors.cyan}
                                        labelStyle={styles.checkLabel}
                                    />
                                    <View style={styles.attachmentSection}>
                                        <Text style={styles.attachmentTitle}>
                                            {Message.get(MessageKeys.issue_report_attachments)}
                                        </Text>
                                        <View style={styles.attachmentActions}>
                                            <FlatButton onPress={() => void this.onPickImage()}>
                                                {Message.get(MessageKeys.issue_report_attach_image)}
                                            </FlatButton>
                                            <FlatButton onPress={() => void this.onPickFile()}>
                                                {Message.get(MessageKeys.issue_report_attach_file)}
                                            </FlatButton>
                                        </View>
                                        {this.state.attachments.map((file, index) => (
                                            <View key={file.uri} style={styles.attachmentRow}>
                                                <Text
                                                    style={styles.attachmentName}
                                                    numberOfLines={1}
                                                >
                                                    {file.name}
                                                </Text>
                                                <TouchableOpacity
                                                    accessibilityRole="button"
                                                    accessibilityLabel={Message.get(
                                                        MessageKeys.issue_report_remove_attachment,
                                                    )}
                                                    onPress={() => this.removeAttachment(index)}
                                                    testID={`issue-attachment-remove-${index}`}
                                                >
                                                    <Text style={styles.attachmentRemove}>×</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                        {this.state.attachmentError ? (
                                            <Text style={styles.errorText}>
                                                {this.state.attachmentError}
                                            </Text>
                                        ) : null}
                                    </View>
                                    {error ? (
                                        <ContentText style={styles.errorText}>{error}</ContentText>
                                    ) : null}
                                </>
                            )}
                        </View>
                    </ScrollView>
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <FlatButton labelStyle={styles.button} onPress={() => this.close()}>
                        {Message.get(MessageKeys.cancel)}
                    </FlatButton>
                    {!success && (
                        <FlatButton
                            labelStyle={styles.button}
                            disabled={loading || !this.state.title.trim()}
                            onPress={() => this.onSend()}
                        >
                            {loading
                                ? "Sending..."
                                : Message.get(MessageKeys.issue_report_send_button)}
                        </FlatButton>
                    )}
                </Dialog.Actions>
            </Dialog>
        );
    }

    private addAttachments(files: IssueAttachmentInput[]): void {
        const allowed = files.filter((file) => isAttachmentSizeAllowed(file.size));
        const rejected = allowed.length !== files.length;

        this.setState((state) => {
            const remaining = Math.max(0, MAX_ISSUE_ATTACHMENTS - state.attachments.length);
            const existing = new Set(state.attachments.map((file) => file.uri));
            const additions = allowed.filter((file) => !existing.has(file.uri));
            return {
                attachments: [...state.attachments, ...additions.slice(0, remaining)],
                attachmentError: rejected
                    ? Message.get(MessageKeys.issue_report_attachment_too_large)
                    : additions.length > remaining
                      ? Message.get(MessageKeys.issue_report_attachment_limit)
                      : undefined,
            };
        });
    }

    private removeAttachment(index: number): void {
        this.setState((state) => ({
            attachments: state.attachments.filter((_, current) => current !== index),
            attachmentError: undefined,
        }));
    }

    private async onPickImage(): Promise<void> {
        const ImagePicker = await import("expo-image-picker");
        if (Platform.OS !== "web") {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                this.setState({
                    attachmentError: Message.get(MessageKeys.issue_report_media_permission_error),
                });
                return;
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsMultipleSelection: true,
            selectionLimit: MAX_ISSUE_ATTACHMENTS,
            quality: 0.8,
        });
        if (result.canceled) return;

        this.addAttachments(
            result.assets.map((asset) => ({
                uri: asset.uri,
                name: asset.fileName ?? `image-${Date.now()}.jpg`,
                contentType: asset.mimeType ?? "image/jpeg",
                size: asset.fileSize,
            })),
        );
    }

    private async onPickFile(): Promise<void> {
        const DocumentPicker = await import("expo-document-picker");
        const result = await DocumentPicker.getDocumentAsync({
            multiple: true,
            copyToCacheDirectory: true,
        });
        if (result.canceled) return;

        this.addAttachments(
            result.assets.map((asset) => ({
                uri: asset.uri,
                name: asset.name,
                contentType: asset.mimeType ?? "application/octet-stream",
                size: asset.size,
            })),
        );
    }

    private async onSend(): Promise<void> {
        const { title, description, reproduce_steps, critical, anonymous, attachLogs } = this.state;
        const logs = attachLogs ? LogService.toText() : undefined;
        await useIssueStore.getState().createIssue(
            {
                title,
                description,
                reproduce_steps,
                critical,
                anonymous,
                logs: logs || undefined,
            },
            this.state.attachments,
        );
        this.forceUpdate();
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
    content: { padding: 8 },
    input: { marginBottom: 8 },
    checkRow: { marginTop: 4 },
    checkLabel: { color: Colors.white },
    attachmentSection: { marginTop: 8 },
    attachmentTitle: { color: Colors.white, fontSize: 12, fontWeight: "bold" },
    attachmentActions: { flexDirection: "row", flexWrap: "wrap" },
    attachmentRow: {
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: Colors.blue,
        paddingVertical: 4,
    },
    attachmentName: { flex: 1, color: Colors.white, fontSize: 11 },
    attachmentRemove: { color: Colors.cyan, fontSize: 18, paddingHorizontal: 8 },
    button: { color: Colors.cyan },
    successText: { color: Colors.first_accent_color, textAlign: "center", padding: 16 },
    errorText: { color: "#ff4310", marginTop: 8 },
});
//#endregion
