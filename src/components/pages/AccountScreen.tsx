//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import React, { type FunctionComponent } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Message, MessageKeys } from "../../constants";
import { useAcount, useWindowDimensions } from "../../hooks";
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
                    <Text style={styles.navButtonText}>Messages</Text>
                </TouchableOpacity>
                {hasRoles && (
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => navigate("AccountRoles")}
                    >
                        <Text style={styles.navButtonText}>Roles</Text>
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
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigate("ChangeEmail")}
                >
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
});
//#endregion
