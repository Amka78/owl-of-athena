//#region Import Modules
import type { FunctionComponent } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import { useDeviceInfo } from "../../hooks/useDeviceInfo";
import { useDeviceMaintenance } from "../../hooks/useDeviceMaintenance";
import { buildAuroraInfoRows } from "../../utils/AuroraInfoRows";
import { FlatButton } from "../ui";
//#endregion

//#region Component
export const DeviceScreen: FunctionComponent = () => {
    const osInfo = useDeviceInfo();
    const deviceMaintenance = useDeviceMaintenance();
    const connected = deviceMaintenance.connected;
    const busy = deviceMaintenance.busy;
    const disabled = !connected || busy;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    {connected && osInfo ? (
                        <View style={styles.table}>
                            {buildAuroraInfoRows(osInfo).map((row) => (
                                <View key={row.label} style={styles.row}>
                                    <Text style={styles.label}>{row.label}</Text>
                                    <Text style={styles.value}>{row.value}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.hint}>
                            {Message.get(MessageKeys.device_not_connected)}
                        </Text>
                    )}
                </View>
                <View style={styles.buttonRow}>
                    <FlatButton
                        disabled={disabled}
                        labelStyle={styles.buttonLabel}
                        onPress={deviceMaintenance.onFormatSdCardPress}
                    >
                        {Message.get(MessageKeys.device_sd_format_button)}
                    </FlatButton>
                    <FlatButton
                        disabled={disabled}
                        labelStyle={styles.buttonLabel}
                        onPress={deviceMaintenance.onResetDevicePress}
                    >
                        {Message.get(MessageKeys.device_reset_button)}
                    </FlatButton>
                </View>
            </ScrollView>
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.navy },
    content: { paddingHorizontal: Dimens.content_margin_horizontal + 16, paddingVertical: 16 },
    card: {
        backgroundColor: Colors.cardBackgroundColor,
        borderRadius: 8,
        padding: 16,
    },
    table: { gap: 10 },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        color: Colors.gray,
        flex: 1,
        fontFamily: Fonts.primaryRegular,
        fontSize: Dimens.option_text_size,
    },
    value: {
        color: Colors.white,
        flex: 1,
        fontFamily: Fonts.primaryRegular,
        fontSize: Dimens.option_text_size,
        textAlign: "right",
    },
    hint: {
        color: Colors.white,
        fontFamily: Fonts.primaryRegular,
        fontSize: Dimens.option_text_size,
        opacity: 0.6,
    },
    buttonRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    buttonLabel: { color: Colors.cyan },
});
//#endregion
