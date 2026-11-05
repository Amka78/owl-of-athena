//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import type { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import { Colors, Message, type MessageKeys } from "../../constants";
import { ListItem } from "../atoms";

//#endregion

//#region Types
type AdminMenuItem = {
    route: string;
    labelKey: keyof typeof MessageKeys;
};

const menuItems: AdminMenuItem[] = [
    { route: "AdminUsers", labelKey: "admin_users_title" },
    { route: "AdminOrders", labelKey: "admin_orders_title" },
    { route: "AdminSessions", labelKey: "admin_sessions_title" },
    { route: "AdminIssues", labelKey: "admin_issues_title" },
    { route: "AdminMessages", labelKey: "admin_messages_title" },
];
//#endregion

//#region Component
export const AdminMenuScreen: FunctionComponent = () => {
    const { navigate } = useNavigation<any>();

    return (
        <View style={styles.container}>
            {menuItems.map((item) => (
                <View key={item.route} style={styles.row}>
                    <ListItem
                        title={Message.get(item.labelKey)}
                        onPress={() => navigate(item.route)}
                    />
                </View>
            ))}
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.navy },
    row: { borderBottomWidth: 1, borderBottomColor: Colors.blue },
});
//#endregion
