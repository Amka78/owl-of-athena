//#region Import Modules
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Checkbox, Dialog } from "react-native-paper";
import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import { useIssueStore } from "../../store/issueStore";
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
};
//#endregion

//#region Component
export class IssueReportDialog extends React.Component<{}, IssueReportDialogState> {
    public static Instance?: IssueReportDialog;

    public static show(args: IssueReportDialogSettings = {}): void {
        IssueReportDialog.Instance!.setState({ settings: args });
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
        });
        useIssueStore.getState().reset();
    }

    public render(): React.ReactNode {
        if (!this.state.settings) return null;

        const { loading, success, error } = useIssueStore.getState();

        return (
            <Dialog
                visible={true}
                onDismiss={() => this.close()}
                style={styles.dialog}
            >
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
                                        label={Message.get(MessageKeys.issue_report_input_description)}
                                        value={this.state.description}
                                        onChangeText={(t) => this.setState({ description: t })}
                                        multiline
                                        numberOfLines={3}
                                        style={styles.input}
                                    />
                                    <ValidatableTextBox
                                        label={Message.get(MessageKeys.issue_report_input_reproduce_steps)}
                                        value={this.state.reproduce_steps}
                                        onChangeText={(t) => this.setState({ reproduce_steps: t })}
                                        multiline
                                        numberOfLines={3}
                                        style={styles.input}
                                    />
                                    <View style={styles.checkRow}>
                                        <Checkbox.Item
                                            label={Message.get(MessageKeys.issue_report_check_critical)}
                                            status={this.state.critical ? "checked" : "unchecked"}
                                            onPress={() => this.setState((s) => ({ critical: !s.critical }))}
                                            color={Colors.cyan}
                                            labelStyle={styles.checkLabel}
                                        />
                                        <Checkbox.Item
                                            label={Message.get(MessageKeys.issue_report_check_anonymous)}
                                            status={this.state.anonymous ? "checked" : "unchecked"}
                                            onPress={() => this.setState((s) => ({ anonymous: !s.anonymous }))}
                                            color={Colors.cyan}
                                            labelStyle={styles.checkLabel}
                                        />
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
                            {loading ? "Sending..." : Message.get(MessageKeys.issue_report_send_button)}
                        </FlatButton>
                    )}
                </Dialog.Actions>
            </Dialog>
        );
    }

    private async onSend(): Promise<void> {
        const { title, description, reproduce_steps, critical, anonymous } = this.state;
        await useIssueStore.getState().createIssue({ title, description, reproduce_steps, critical, anonymous });
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
    button: { color: Colors.cyan },
    successText: { color: Colors.first_accent_color, textAlign: "center", padding: 16 },
    errorText: { color: "#ff4310", marginTop: 8 },
});
//#endregion
