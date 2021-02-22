//#region Import Modules
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { View } from "react-native";

import {
    AudioDialog,
    ConfirmDialog,
    LoadingDialog,
    ProfilesDialog,
} from "../components/molecules";
import {
    AwakeScreen,
    HomeScreen,
    SettingsScreen,
    SleepingScreen,
    WakingScreen,
} from "../components/pages";
import { Colors } from "../constants";
import { useWindowDimensions } from "../hooks";
import { SoundManagerInstance } from "../managers";
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
                ></Stack.Screen>
                <Stack.Screen
                    name={"Sleeping"}
                    component={SleepingScreen}
                    options={{
                        headerLeft: voidLeftHeader,
                    }}
                ></Stack.Screen>
                <Stack.Screen
                    name={"Waking"}
                    component={WakingScreen}
                    options={{
                        headerLeft: voidLeftHeader,
                    }}
                ></Stack.Screen>
            </Stack.Navigator>
            <LoadingDialog></LoadingDialog>
            <ConfirmDialog
                dialogContainer={{ width: dimens.width }}
            ></ConfirmDialog>
            <AudioDialog
                auroraSoundList={SoundManagerInstance.getData()}
                dialogContainer={{ width: dimens.width }}
            ></AudioDialog>
            <ProfilesDialog></ProfilesDialog>
        </View>
    );
};
//#endregion

export default HomeNavigator;
