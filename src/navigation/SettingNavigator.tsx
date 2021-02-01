//#region Import Modules
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { View } from "react-native";

import { Colors, Message, MessageKeys } from "../constants";
import { AccountScreen } from "../screens";
import { CommonStyles } from "../styles";
//#endregion

//#region Component
const Stack = createStackNavigator();

const SettingNavigator = (): JSX.Element => {
    const voidLeftHeader = (): JSX.Element => <View></View>;
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: "center",
                headerStyle: CommonStyles.headerStyle,
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
        </Stack.Navigator>
    );
};
//#endregion

export default SettingNavigator;
