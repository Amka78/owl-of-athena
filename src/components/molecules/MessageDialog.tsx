//#region Import Modules
import React from "react";
import { StyleSheet, View } from "react-native";
import { Dialog } from "react-native-paper";
import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import type { UserMessage } from "../../types";
import { ContentText, FlatButton } from "../atoms";

//#endregion

//#region Types
type MessageDialogSettings = {
    message: UserMessage;
    onMarkAsRead?: (id: string) => void;
    onStartQuestionnaire?: (message: UserMessage) => void;
    onClose?: () => void;
};

type MessageDialogState = {
    settings?: MessageDialogSettings;
};
//#endregion

//#region Component
export class MessageDialog extends React.Component<{}, MessageDialogState> {
    public static Instance?: MessageDialog;

    public static show(args: MessageDialogSettings): void {
        MessageDialog.Instance!.setState({ settings: args });
    }

    constructor(props: {}) {
        super(props);
        this.state = { settings: undefined };
    }

    public async componentDidMount(): Promise<void> {
        MessageDialog.Instance = this;
    }

    private close(): void {
        if (this.state.settings?.onClose) this.state.settings.onClose();
        this.setState({ settings: undefined });
    }

    public render(): React.ReactNode {
        const { settings } = this.state;
        if (!settings) return null;

        const { message } = settings;
        const isRead = !!message.read_at;
        const hasQuestionnaire = !!message.questionnaire_id;
        const alreadyRespondedToQuestionnaire = isRead && !!message.questionnaire_respondent_id;

        return (
            <Dialog
                visible={true}
                onDismiss={() => this.close()}
                style={styles.dialog}
            >
                <Dialog.Title style={styles.title}>{message.title ?? "—"}</Dialog.Title>
                <Dialog.Content>
                    <ContentText>{message.message}</ContentText>
                    {alreadyRespondedToQuestionnaire && (
                        <ContentText style={styles.completedNote}>
                            {Message.get(MessageKeys.messages_already_completed)}
                        </ContentText>
                    )}
                </Dialog.Content>
                <Dialog.Actions>
                    {!isRead && (
                        <FlatButton
                            labelStyle={styles.secondaryButton}
                            onPress={() => this.close()}
                        >
                            {Message.get(MessageKeys.messages_save_for_later)}
                        </FlatButton>
                    )}
                    {!isRead && hasQuestionnaire ? (
                        <FlatButton
                            labelStyle={styles.primaryButton}
                            onPress={() => this.onStartQuestionnaire()}
                        >
                            {message.questionnaire_respondent_id
                                ? Message.get(MessageKeys.messages_continue_questionnaire)
                                : Message.get(MessageKeys.messages_begin_questionnaire)}
                        </FlatButton>
                    ) : !isRead ? (
                        <FlatButton
                            labelStyle={styles.primaryButton}
                            onPress={() => this.onMarkAsRead()}
                        >
                            {Message.get(MessageKeys.messages_mark_as_read)}
                        </FlatButton>
                    ) : (
                        <FlatButton labelStyle={styles.primaryButton} onPress={() => this.close()}>
                            {Message.get(MessageKeys.ok)}
                        </FlatButton>
                    )}
                </Dialog.Actions>
            </Dialog>
        );
    }

    private onMarkAsRead(): void {
        const { settings } = this.state;
        if (!settings) return;
        settings.onMarkAsRead?.(settings.message.id);
        this.close();
    }

    private onStartQuestionnaire(): void {
        const { settings } = this.state;
        if (!settings) return;
        settings.onStartQuestionnaire?.(settings.message);
        this.close();
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
    primaryButton: { color: Colors.cyan },
    secondaryButton: { color: Colors.white },
    completedNote: { color: Colors.first_accent_color, marginTop: 8, fontStyle: "italic" },
});
//#endregion
