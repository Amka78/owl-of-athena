//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import type { FunctionComponent } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Message, MessageKeys } from "../../constants";
import { useAcount, useWindowDimensions } from "../../hooks";
import { useDeviceMaintenance } from "../../hooks/useDeviceMaintenance";
import { useUnreadMessageCount } from "../../hooks/useUnreadMessageCount";
import { useAuthStore } from "../../store/authStore";
import { IssueReportDialog } from "../molecules/IssueReportDialog";
import { AccountScreenTemplate } from "./../templates/AccountScreenTemplate";
//#endregion

//#region Component
export const AccountScreen: FunctionComponent = () => {
    const accountHook = useAcount();
    const dimens = useWindowDimensions();
    const { navigate } = useNavigation<any>();
    const { user } = useAuthStore();
    const hasRoles = (user?.roles?.length ?? 0) > 0;
    const isAdmin = user?.roles?.some((role) => role.slug === "admin") ?? false;
    const unreadCount = useUnreadMessageCount();
    const deviceMaintenance = useDeviceMaintenance();

    return (
        <View style={styles.container}>
            <AccountScreenTemplate
                firstName={{
                    onChangeText: accountHook.onFirstNameChangeText,
                    value: accountHook.firstName,
                }}
                lastName={{
                    onChangeText: accountHook.onLastNameChangeText,
                    value: accountHook.lastName,
                }}
                birthDay={{
                    onChange: accountHook.onBirthDayChange,
                    selected: accountHook.birthDay,
                }}
                gender={{
                    onValueChange: accountHook.onGenderChange,
                    value: accountHook.gender,
                }}
                maleRadioButton={{
                    value: "male",
                }}
                countryCode={{
                    value: accountHook.countryCode,
                    onChangeText: accountHook.onCountryCodeChangeText,
                }}
                postalCode={{
                    value: accountHook.postalCode,
                    onChangeText: accountHook.onPostalCodeChangeText,
                }}
                femaleRadioButton={{
                    value: "female",
                }}
                saveButton={{
                    onPress: accountHook.onSavePress,
                }}
                logoutButton={{
                    onPress: accountHook.onLogoutPress,
                }}
                dimens={dimens}
            ></AccountScreenTemplate>
            <View style={styles.navSection}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigate("AccountMessages")}
                >
                    <View style={styles.navButtonContent}>
                        <Text style={styles.navButtonText}>
                            {Message.get(MessageKeys.account_messages_title)}
                        </Text>
                        {unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text
                                    style={styles.unreadBadgeText}
                                    testID="unread-message-badge-text"
                                >
                                    {unreadCount > 99 ? "99+" : String(unreadCount)}
                                </Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
                {hasRoles && (
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => navigate("AccountRoles")}
                    >
                        <Text style={styles.navButtonText}>
                            {Message.get(MessageKeys.account_roles_title)}
                        </Text>
                    </TouchableOpacity>
                )}
                {isAdmin && (
                    <TouchableOpacity style={styles.navButton} onPress={() => navigate("Console")}>
                        <Text style={styles.navButtonText}>
                            {Message.get(MessageKeys.console_title)}
                        </Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigate("ChangePassword")}
                >
                    <Text style={styles.navButtonText}>
                        {Message.get(MessageKeys.change_password_nav_button)}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => navigate("ChangeEmail")}>
                    <Text style={styles.navButtonText}>
                        {Message.get(MessageKeys.change_email_nav_button)}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => IssueReportDialog.show({})}
                >
                    <Text style={styles.navButtonText}>
                        {Message.get(MessageKeys.issue_report_button)}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => navigate("About")}>
                    <Text style={styles.navButtonText}>{Message.get(MessageKeys.about_title)}</Text>
                </TouchableOpacity>
                <View style={styles.deviceSection}>
                    <Text style={styles.deviceSectionTitle}>
                        {Message.get(MessageKeys.device_section_title)}
                    </Text>
                    <View style={styles.deviceButtons}>
                        <TouchableOpacity
                            style={[
                                styles.navButton,
                                (!deviceMaintenance.connected || deviceMaintenance.busy) &&
                                    styles.navButtonDisabled,
                            ]}
                            disabled={!deviceMaintenance.connected || deviceMaintenance.busy}
                            onPress={deviceMaintenance.onFormatSdCardPress}
                        >
                            <Text style={styles.navButtonText}>
                                {Message.get(MessageKeys.device_sd_format_button)}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.navButton,
                                (!deviceMaintenance.connected || deviceMaintenance.busy) &&
                                    styles.navButtonDisabled,
                            ]}
                            disabled={!deviceMaintenance.connected || deviceMaintenance.busy}
                            onPress={deviceMaintenance.onResetDevicePress}
                        >
                            <Text style={styles.navButtonText}>
                                {Message.get(MessageKeys.device_reset_button)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {!deviceMaintenance.connected ? (
                        <Text style={styles.deviceHint}>
                            {Message.get(MessageKeys.device_not_connected)}
                        </Text>
                    ) : null}
                </View>
            </View>
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.navy },
    navSection: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.blue,
        gap: 8,
    },
    navButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: Colors.first_accent_color,
        borderRadius: 4,
    },
    navButtonText: { color: Colors.first_accent_color, fontSize: 14 },
    navButtonDisabled: { opacity: 0.4 },
    deviceSection: {
        width: "100%",
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.blue,
    },
    deviceSectionTitle: { color: Colors.cyan, fontSize: 13, marginBottom: 6 },
    deviceButtons: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    deviceHint: { color: Colors.white, opacity: 0.6, fontSize: 11, marginTop: 6 },
    navButtonContent: { flexDirection: "row", alignItems: "center", gap: 6 },
    unreadBadge: {
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        paddingHorizontal: 5,
        backgroundColor: Colors.red,
        alignItems: "center",
        justifyContent: "center",
    },
    unreadBadgeText: { color: Colors.white, fontSize: 10, fontWeight: "bold" },
});
//#endregion
