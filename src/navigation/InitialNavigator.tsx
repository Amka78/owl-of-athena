//#region Import Modules
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import { MainScreen } from "../components/pages";
import { UnauthenticatedNavigator } from "./UnauthenticatedNavigator";
//#endregion

//#region Component
const Stack = createStackNavigator();
const InitialNavigator = (): JSX.Element => {
    return (
        <Stack.Navigator initialRouteName="Unauthenticated" headerMode={"none"}>
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
