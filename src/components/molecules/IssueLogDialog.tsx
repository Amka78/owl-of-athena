//#region Import Modules
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Dialog } from "react-native-paper";
import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import { FlatButton } from "../atoms";

//#endregion

//#region Types
type IssueLogDialogSettings = {
    title?: string;
    logs: string;
};

type IssueLogDialogState = {
    settings?: IssueLogDialogSettings;
};
//#endregion

//#region Component
export class IssueLogDialog extends React.Component<{}, IssueLogDialogState> {
    public static Instance?: IssueLogDialog;

    public static show(args: IssueLogDialogSettings): void {
        IssueLogDialog.Instance?.setState({ settings: args });
    }

    constructor(props: {}) {
        super(props);
        this.state = { settings: undefined };
    }

    public componentDidMount(): void {
        IssueLogDialog.Instance = this;
    }

    public componentWillUnmount(): void {
        if (IssueLogDialog.Instance === this) {
            IssueLogDialog.Instance = undefined;
        }
    }

    private close(): void {
        this.setState({ settings: undefined });
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
                        <Text selectable style={styles.logs}>
                            {settings.logs}
                        </Text>
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
    button: { color: Colors.cyan },
});
//#endregion
