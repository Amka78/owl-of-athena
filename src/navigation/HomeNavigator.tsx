//#region Import Modules
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { View } from "react-native";

import { ConfirmDialog, LoadingDialog } from "../components/molecules";
import {
    AwakeScreen,
    HomeScreen,
    SettingsScreen,
    SleepingScreen,
    WakingScreen,
} from "../components/pages";
import { Colors, Message, MessageKeys } from "../constants";
import { useWindowDimensions } from "../hooks";
import { CommonStyles } from "../styles";
//#endregion

//#region Component
const Stack = createStackNavigator();

const HomeNavigator = (): JSX.Element => {
    const voidLeftHeader = (): JSX.Element => <View></View>;
    const dimens = useWindowDimensions();
    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator
                initialRouteName={"Home"}
                screenOptions={{
                    headerTitleAlign: "center",
                    headerTintColor: Colors.cyan,
                    headerStyle: CommonStyles.headerStyle,
                }}
            >
                <Stack.Screen
                    name={"Awake"}
                    component={AwakeScreen}
                    options={{
                        headerLeft: voidLeftHeader,
                        headerTitle: Message.get(MessageKeys.awake_title),
                    }}
                ></Stack.Screen>
                <Stack.Screen
                    name={"Home"}
                    component={HomeScreen}
                    options={{
                        headerLeft: voidLeftHeader,
                    }}
                ></Stack.Screen>
                <Stack.Screen
                    name={"Settings"}
                    component={SettingsScreen}
                    options={{
                        headerTitle: Message.get(MessageKeys.settings_title),
                    }}
                ></Stack.Screen>
                <Stack.Screen
                    name={"Sleeping"}
                    component={SleepingScreen}
                    options={{
                        headerLeft: voidLeftHeader,
                        headerTitle: Message.get(MessageKeys.sleeping_title),
                    }}
                ></Stack.Screen>
                <Stack.Screen
                    name={"Waking"}
                    component={WakingScreen}
                    options={{
                        headerLeft: voidLeftHeader,
                        headerTitle: Message.get(MessageKeys.waking_title),
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

export default HomeNavigator;
