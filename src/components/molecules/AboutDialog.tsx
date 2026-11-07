//#region Import Modules
import React from "react";
import { Linking, ScrollView, StyleSheet } from "react-native";
import { Dialog } from "react-native-paper";

import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import { getAppInfo } from "../../utils";
import { FlatButton } from "../atoms";
import { AboutContent, type AboutInfoRow } from "./AboutContent";

//#endregion

//#region Types
type AboutDialogState = {
    visible: boolean;
};
//#endregion

//#region Component
export class AboutDialog extends React.Component<{}, AboutDialogState> {
    public static Instance?: AboutDialog;

    public static show(): void {
        AboutDialog.Instance?.setState({ visible: true });
    }

    constructor(props: {}) {
        super(props);
        this.state = { visible: false };
    }

    public componentDidMount(): void {
        AboutDialog.Instance = this;
    }

    private close(): void {
        this.setState({ visible: false });
    }

    private onRepositoryPress = (): void => {
        const info = getAppInfo();
        if (!info.repositoryUrl) return;
        Linking.openURL(info.repositoryUrl).catch((error) => {
            console.debug("failed to open repository url:", error);
        });
    };

    public render(): React.ReactNode {
        if (!this.state.visible) {
            return null;
        }

        const info = getAppInfo();
        const rows: AboutInfoRow[] = [
            { label: Message.get(MessageKeys.about_version_label), value: info.version },
            { label: Message.get(MessageKeys.about_build_label), value: info.build },
            { label: Message.get(MessageKeys.about_sdk_label), value: info.sdkVersion },
            { label: Message.get(MessageKeys.about_platform_label), value: info.platform },
            { label: Message.get(MessageKeys.about_os_label), value: info.osVersion },
        ];

        return (
            <Dialog visible={true} onDismiss={() => this.close()} style={styles.dialog}>
                <Dialog.Title style={styles.title}>
                    {Message.get(MessageKeys.about_title)}
                </Dialog.Title>
                <Dialog.Content>
                    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                        <AboutContent
                            appName={info.name}
                            description={info.description}
                            rows={rows}
                            repositoryUrl={info.repositoryUrl}
                            onRepositoryPress={this.onRepositoryPress}
                        />
                    </ScrollView>
                </Dialog.Content>
                <Dialog.Actions>
                    <FlatButton labelStyle={styles.button} onPress={() => this.close()}>
                        {Message.get(MessageKeys.close)}
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
        backgroundColor: Colors.navy_darker,
    },
    title: {
        color: Colors.cyan,
        fontFamily: Fonts.primarySemiBold,
    },
    scroll: {
        maxHeight: Dimens.inner_screen_max_height * 0.6,
    },
    scrollContent: {
        paddingBottom: Dimens.items_margin,
    },
    button: { color: Colors.cyan },
});
//#endregion
