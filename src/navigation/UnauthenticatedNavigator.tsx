//#region Import Modules
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import { Colors } from "../constants";
import { LoginScreen, SignupScreen, WelcomeScreen } from "../screens";
import { ForgotPasswordScreen } from "../screens/ForgotPassswordScreen";
import { CommonStyles } from "../styles";
//#endregion

//#region Component
const Stack = createStackNavigator();

const UnauthenticatedNavigator = (): JSX.Element => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: "center",
                headerTintColor: Colors.cyan,
                headerStyle: CommonStyles.headerStyle,
                headerTitle: "",
            }}
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

export default UnauthenticatedNavigator;
