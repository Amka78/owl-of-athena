//#region Import Modules
import type { FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "../../constants";
import { SessionsIcon, type SessionsIconProps } from "./SessionsIcon";
//#endregion

//#region Types
export type SessionsIconWithBadgeProps = SessionsIconProps & {
    badgeCount?: number;
};
//#endregion

//#region Component
export const SessionsIconWithBadge: FunctionComponent<SessionsIconWithBadgeProps> = (
    props: SessionsIconWithBadgeProps,
) => {
    const { badgeCount, ...iconProps } = props;
    const count = badgeCount ?? 0;
    return (
        <View style={styles.container}>
            <SessionsIcon {...iconProps}></SessionsIcon>
            {count > 0 && (
                <View style={styles.badge} pointerEvents="none">
                    <Text style={styles.badgeText} testID="session-badge-text">
                        {count > 99 ? "99+" : String(count)}
                    </Text>
                </View>
            )}
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: { alignItems: "center", justifyContent: "center" },
    badge: {
        position: "absolute",
        top: -2,
        right: -6,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        paddingHorizontal: 3,
        backgroundColor: Colors.first_accent_color,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeText: { color: Colors.white, fontSize: 9, fontWeight: "bold" },
});
//#endregion
