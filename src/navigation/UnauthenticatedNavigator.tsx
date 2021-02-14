//#region Import Modules
import {
    createStackNavigator,
    StackNavigationOptions,
} from "@react-navigation/stack";
import * as React from "react";

import { LoginScreen, SignupScreen, WelcomeScreen } from "../components/pages";
import { ForgotPasswordScreen } from "../components/pages/ForgotPassswordScreen";
import { Colors } from "../constants";
import { CommonStyles } from "../styles";
//#endregion

//#region Component
export const Stack = createStackNavigator();

export const UnauthenticatedNavigatorScreenOptions: StackNavigationOptions = {
    headerTitleAlign: "center",
    headerTintColor: Colors.cyan,
    headerStyle: CommonStyles.headerStyle,
    headerTitle: "",
};

export const UnauthenticatedNavigator = (): JSX.Element => {
    return (
        <Stack.Navigator
            screenOptions={UnauthenticatedNavigatorScreenOptions}
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
            <Stack.Screen name={"Login"} component={LoginScreen}></Stack.Screen>
            <Stack.Screen
                name={"Welcome"}
                component={WelcomeScreen}
                options={{
                    headerShown: false,
                }}
            ></Stack.Screen>
        </Stack.Navigator>
    );
};
//#endregion
