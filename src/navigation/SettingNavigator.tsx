//#region Import Modules
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { View } from "react-native";

import { Colors, Message, MessageKeys } from "../constants";
import { AccountScreen } from "../components/pages";
import { CommonStyles } from "../styles";
import { ConfirmDialog, LoadingDialog } from "../components/molecules";
import { useWindowDimensions } from "../hooks";
//#endregion

//#region Component
const Stack = createStackNavigator();

const SettingNavigator = (): JSX.Element => {
    const voidLeftHeader = (): JSX.Element => <View></View>;
    const dimens = useWindowDimensions();
    return (
        <View style={{ flex: 1 }}>
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
            <LoadingDialog></LoadingDialog>
            <ConfirmDialog
                dialogContainer={{ width: dimens.width }}
            ></ConfirmDialog>
        </View>
    );
};
//#endregion

export default SettingNavigator;
