//#region Import modules
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as React from "react";

import { Colors, Message, MessageKeys } from "../constants";
import { SessionNoteScreen, SessionScreen } from "../components/pages";
//#endregion

//#region Component
const MaterialTab = createMaterialTopTabNavigator();

const SessionTabNavigator = (): JSX.Element => {
    return (
        <MaterialTab.Navigator
            tabBarOptions={{
                activeTintColor: Colors.first_accent_color,
                inactiveTintColor: Colors.cyan,
                style: { backgroundColor: Colors.navy },
                pressColor: Colors.first_accent_color,
                labelStyle: { fontWeight: "bold" },
            }}
        >
            <MaterialTab.Screen
                name={"SleepTracking"}
                component={SessionScreen}
                options={{
                    title: Message.get(
                        MessageKeys.top_tab_sleep_tracking_title
                    ),
                }}
            ></MaterialTab.Screen>
            <MaterialTab.Screen
                name={"Journal"}
                component={SessionNoteScreen}
                options={{
                    title: Message.get(
                        Message.get(MessageKeys.top_tab_journal_title)
                    ),
                }}
            ></MaterialTab.Screen>
        </MaterialTab.Navigator>
    );
};
//#endregion

export default SessionTabNavigator;
