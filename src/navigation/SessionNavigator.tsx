//#region Import Modules
import { createStackNavigator } from "@react-navigation/stack";
import moment from "moment";
import * as React from "react";

import { SessionListScreen } from "../components/pages";
import { Colors, Message, MessageKeys } from "../constants";
import { useSelectedSessionSelector, useWindowDimensions } from "../hooks";
import { CommonStyles } from "../styles";
import SessionTabNavigator from "./SessionTabNavigator";
//#endregion

//#region Component
const Stack = createStackNavigator();

const SessionNavigator = (): JSX.Element => {
    const sessionSelector = useSelectedSessionSelector();
    const dimens = useWindowDimensions();
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
                    headerTitle: !dimens.isDesktop
                        ? Message.get(MessageKeys.session_list_title)
                        : "",
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
