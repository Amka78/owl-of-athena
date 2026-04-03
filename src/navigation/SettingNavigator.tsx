//#region Import Modules
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { View } from "react-native";

import { AccountScreen } from "../components/pages";
import { Colors, Message, MessageKeys } from "../constants";
import { headerStyle } from "./HeaderStyles";

//#endregion

//#region Component
const Stack = createStackNavigator();

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
            </Stack.Navigator>
        </View>
    );
};
//#endregion

export default SettingNavigator;
