//#region Import Modules
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type * as React from "react";
import { View } from "react-native";

import {
    AdminAppSettingsScreen,
    AdminIssuesScreen,
    AdminMessagesScreen,
    AdminOrdersScreen,
    AdminSessionsScreen,
    AdminUsersScreen,
} from "../components/pages";
import { Colors, Message, MessageKeys } from "../constants";
import { headerStyle } from "./HeaderStyles";
import { StackCommonScreenOptions } from "./StackSettings";

//#endregion

//#region Component
const Stack = createNativeStackNavigator();

const AdminNavigator = (): React.ReactNode => {
    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator
                screenOptions={{
                    ...StackCommonScreenOptions,
                    headerStyle: headerStyle,
                    headerTintColor: Colors.cyan,
                }}
                initialRouteName={"AdminUsers"}
            >
                <Stack.Screen
                    name={"AdminUsers"}
                    component={AdminUsersScreen}
                    options={{
                        headerTitle: Message.get(MessageKeys.admin_users_title),
                    }}
                />
                <Stack.Screen
                    name={"AdminOrders"}
                    component={AdminOrdersScreen}
                    options={{
                        headerTitle: Message.get(MessageKeys.admin_orders_title),
                    }}
                />
                <Stack.Screen
                    name={"AdminSessions"}
                    component={AdminSessionsScreen}
                    options={{
                        headerTitle: Message.get(MessageKeys.admin_sessions_title),
                    }}
                />
                <Stack.Screen
                    name={"AdminIssues"}
                    component={AdminIssuesScreen}
                    options={{
                        headerTitle: Message.get(MessageKeys.admin_issues_title),
                    }}
                />
                <Stack.Screen
                    name={"AdminMessages"}
                    component={AdminMessagesScreen}
                    options={{
                        headerTitle: Message.get(MessageKeys.admin_messages_title),
                    }}
                />
                <Stack.Screen
                    name={"AdminAppSettings"}
                    component={AdminAppSettingsScreen}
                    options={{
                        headerTitle: Message.get(MessageKeys.admin_app_settings_title),
                    }}
                />
            </Stack.Navigator>
        </View>
    );
};
//#endregion

//#region Export
export default AdminNavigator;
//#endregion
