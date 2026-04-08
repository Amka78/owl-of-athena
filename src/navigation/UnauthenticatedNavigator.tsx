//#region Import Modules
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type * as React from "react";
import { View } from "react-native";

import { ConfirmDialog, LoadingDialog } from "../components/molecules";
import { LoginScreen, SignupScreen, WelcomeScreen } from "../components/pages";
import { ConfirmEmailScreen } from "../components/pages/ConfirmEmailScreen";
import { ForgotPasswordScreen } from "../components/pages/ForgotPassswordScreen";
import { useWindowDimensions } from "../hooks";
import { StackCommonScreenOptions } from "./StackSettings";
//#endregion

//#region Component
export const Stack = createNativeStackNavigator();

export const UnauthenticatedNavigator = (): React.ReactNode => {
    const dimens = useWindowDimensions();
    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator screenOptions={StackCommonScreenOptions} initialRouteName={"Welcome"}>
                <Stack.Screen name={"ConfirmEmail"} component={ConfirmEmailScreen}></Stack.Screen>
                <Stack.Screen
                    name={"ForgotPassword"}
                    component={ForgotPasswordScreen}
                ></Stack.Screen>
                <Stack.Screen name={"Signup"} component={SignupScreen}></Stack.Screen>
                <Stack.Screen name={"Login"} component={LoginScreen}></Stack.Screen>
                <Stack.Screen
                    name={"Welcome"}
                    component={WelcomeScreen}
                    options={{
                        headerShown: false,
                    }}
                ></Stack.Screen>
            </Stack.Navigator>
            <ConfirmDialog dialogContainer={{ width: dimens.width }}></ConfirmDialog>
            <LoadingDialog></LoadingDialog>
        </View>
    );
};
//#endregion
