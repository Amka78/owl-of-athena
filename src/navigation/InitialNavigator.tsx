//#region Import Modules
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type * as React from "react";

import { MainScreen } from "../components/pages";
import { UnauthenticatedNavigator } from "./UnauthenticatedNavigator";

//#endregion

//#region Component
const Stack = createNativeStackNavigator();
const InitialNavigator = (): React.ReactNode => {
    return (
        <Stack.Navigator initialRouteName="Unauthenticated" screenOptions={{ headerShown: false }}>
            <Stack.Screen name={"Main"} component={MainScreen}></Stack.Screen>
            <Stack.Screen
                name={"Unauthenticated"}
                component={UnauthenticatedNavigator}
            ></Stack.Screen>
        </Stack.Navigator>
    );
};
//#endregion

export default InitialNavigator;
