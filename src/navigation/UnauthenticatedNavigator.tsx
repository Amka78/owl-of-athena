//#region Import Modules
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { View } from "react-native";

import { ConfirmDialog, LoadingDialog } from "../components/molecules";
import { LoginScreen, SignupScreen, WelcomeScreen } from "../components/pages";
import { ForgotPasswordScreen } from "../components/pages/ForgotPassswordScreen";
import { useWindowDimensions } from "../hooks";
import { StackCommonScreenOptions } from "./StackSettings";
//#endregion

//#region Component
export const Stack = createStackNavigator();

export const UnauthenticatedNavigator = (): JSX.Element => {
    const dimens = useWindowDimensions();
    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator
                screenOptions={StackCommonScreenOptions}
                initialRouteName={"Welcome"}
            >
                <Stack.Screen
                    name={"ForgotPassword"}
                    component={ForgotPasswordScreen}
                ></Stack.Screen>
                <Stack.Screen
                    name={"Signup"}
                    component={SignupScreen}
                ></Stack.Screen>
                <Stack.Screen
                    name={"Login"}
                    component={LoginScreen}
                ></Stack.Screen>
                <Stack.Screen
                    name={"Welcome"}
                    component={WelcomeScreen}
                    options={{
                        headerShown: false,
                    }}
                ></Stack.Screen>
            </Stack.Navigator>
            <ConfirmDialog
                dialogContainer={{ width: dimens.width }}
            ></ConfirmDialog>
            <LoadingDialog></LoadingDialog>
        </View>
    );
};
//#endregion
