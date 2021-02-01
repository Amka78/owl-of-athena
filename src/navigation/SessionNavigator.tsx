//#region Import Modules
import { createStackNavigator } from "@react-navigation/stack";
import moment from "moment";
import * as React from "react";

import { Colors, Message, MessageKeys } from "../constants";
import { useSelectedSessionSelector } from "../hooks";
import { SessionListScreen } from "../screens";
import { CommonStyles } from "../styles";
import SessionTabNavigator from "./SessionTabNavigator";
//#endregion

//#region Component
const Stack = createStackNavigator();

const SessionNavigator = (): JSX.Element => {
    const sessionSelector = useSelectedSessionSelector();
    const title = sessionSelector
        ? moment(sessionSelector?.sessionAt).format(
              Message.get(MessageKeys.date_format)
          )
        : "";
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: "center",
                headerTintColor: Colors.cyan,
                headerStyle: CommonStyles.headerStyle,
                headerTitle: "",
            }}
        >
            <Stack.Screen
                name={"List"}
                component={SessionListScreen}
                options={{
                    headerTitle: Message.get(MessageKeys.session_list_title),
                }}
            ></Stack.Screen>
            <Stack.Screen
                name={"Detail"}
                component={SessionTabNavigator}
                options={{ title }}
            ></Stack.Screen>
        </Stack.Navigator>
    );
};
//#endregion

export default SessionNavigator;
