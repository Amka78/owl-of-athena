//#region Import Modules
import React, { type FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors, Message, MessageKeys } from "../../constants";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";
//#endregion

//#region Component
export const OfflineBanner: FunctionComponent = () => {
    const status = useNetworkStatus();

    if (status !== "offline") return null;

    return (
        <View style={styles.container} accessibilityLiveRegion="polite" testID="offline-banner">
            <Text style={styles.text}>{Message.get(MessageKeys.offline_banner_message)}</Text>
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.yellow,
        paddingVertical: 6,
        paddingHorizontal: 12,
        alignItems: "center",
    },
    text: {
        color: Colors.navy,
        fontSize: 12,
    },
});
//#endregion
