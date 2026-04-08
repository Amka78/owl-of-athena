//#region Import Modules
import React from "react";
import { StyleSheet, View } from "react-native";
import { Dialog } from "react-native-paper";

import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import type { AuroraOSInfo } from "../../sdk/models";
import { ContentText, FlatButton } from "../atoms";
//#endregion

//#region Types
type AuroraInfoDialogSettings = {
    osInfo: AuroraOSInfo;
};

type AuroraInfoDialogState = {
    settings?: AuroraInfoDialogSettings;
};
//#endregion

//#region Component
export class AuroraInfoDialog extends React.Component<{}, AuroraInfoDialogState> {
    public static Instance?: AuroraInfoDialog;

    public static show(args: AuroraInfoDialogSettings): void {
        AuroraInfoDialog.Instance!.setState({ settings: args });
    }

    constructor(props: {}) {
        super(props);
        this.state = { settings: undefined };
    }

    public async componentDidMount(): Promise<void> {
        AuroraInfoDialog.Instance = this;
    }

    private close(): void {
        this.setState({ settings: undefined });
    }

    public render(): React.ReactNode {
        const { settings } = this.state;
        if (!settings) return null;

        const { osInfo } = settings;
        const rows: Array<{ label: string; value: string }> = [
            {
                label: Message.get(MessageKeys.aurora_info_firmware),
                value: osInfo.version.toString(),
            },
            {
                label: Message.get(MessageKeys.aurora_info_bootloader),
                value: osInfo.bootloaderVersion.toString(),
            },
            {
                label: Message.get(MessageKeys.aurora_info_ble),
                value: osInfo.bleVersion.toString(),
            },
            {
                label: Message.get(MessageKeys.aurora_info_bootstrap),
                value: osInfo.bootstrapVersion.toString(),
            },
            {
                label: Message.get(MessageKeys.aurora_info_battery),
                value: `${osInfo.batteryLevel}%`,
            },
        ];

        return (
            <Dialog
                visible={true}
                onDismiss={() => this.close()}
                style={styles.dialog}
            >
                <Dialog.Title style={styles.dialogTitle}>
                    {Message.get(MessageKeys.aurora_info_title)}
                </Dialog.Title>
                <Dialog.Content>
                    <View style={styles.table}>
                        {rows.map((row) => (
                            <View key={row.label} style={styles.row}>
                                <ContentText style={styles.label}>{row.label}</ContentText>
                                <ContentText style={styles.value}>{row.value}</ContentText>
                            </View>
                        ))}
                    </View>
                </Dialog.Content>
                <Dialog.Actions>
                    <FlatButton
                        labelStyle={styles.closeButton}
                        onPress={() => this.close()}
                    >
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
        backgroundColor: Colors.navy_darker,
        maxWidth: Dimens.inner_screen_max_width,
        alignSelf: "center",
        width: "90%",
    },
    dialogTitle: {
        color: Colors.cyan,
        fontFamily: Fonts.primaryRegular,
    },
    table: {
        gap: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        color: Colors.gray,
        flex: 1,
    },
    value: {
        color: Colors.white,
        flex: 1,
        textAlign: "right",
    },
    closeButton: {
        color: Colors.first_accent_color,
    },
});
//#endregion
