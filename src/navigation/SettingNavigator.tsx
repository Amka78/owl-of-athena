//#region Import Modules
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type * as React from "react";
import { View } from "react-native";

import {
    AccountMessagesScreen,
    AccountRolesScreen,
    AccountScreen,
    ChangeEmailScreen,
    ChangePasswordScreen,
    ConsoleScreen,
} from "../components/pages";
import { Colors, Message, MessageKeys } from "../constants";
import { headerStyle } from "./HeaderStyles";

//#endregion

//#region Component
const Stack = createNativeStackNavigator();

const SettingNavigator = (): React.ReactNode => {
    const voidLeftHeader = (): React.ReactNode => <View />;
    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator
                screenOptions={{
                    headerTitleAlign: "center",
                    headerStyle: headerStyle,
                    headerTintColor: Colors.cyan,
                }}
                initialRouteName={"Account"}
            >
                <Stack.Screen
                    name={"Account"}
                    component={AccountScreen}
                    options={{
                        headerLeft: voidLeftHeader,
                        headerTitle: Message.get(MessageKeys.account_title),
                    }}
                ></Stack.Screen>
                <Stack.Screen
                    name={"AccountMessages"}
                    component={AccountMessagesScreen}
                    options={{
                        headerTitle: Message.get(MessageKeys.account_messages_title),
                    }}
                />
                <Stack.Screen
                    name={"AccountRoles"}
                    component={AccountRolesScreen}
                    options={{
                        headerTitle: Message.get(MessageKeys.account_roles_title),
                    }}
                />
                <Stack.Screen
                    name={"ChangePassword"}
                    component={ChangePasswordScreen}
                    options={{
                        headerTitle: Message.get(MessageKeys.change_password_title),
                    }}
                />
                <Stack.Screen
                    name={"ChangeEmail"}
                    component={ChangeEmailScreen}
                    options={{
                        headerTitle: Message.get(MessageKeys.change_email_title),
                    }}
                />
                <Stack.Screen
                    name={"Console"}
                    component={ConsoleScreen}
                    options={{
                        headerTitle: Message.get(MessageKeys.console_title),
                    }}
                />
            </Stack.Navigator>
        </View>
    );
};
//#endregion

export default SettingNavigator;
