//#region Import modules
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as React from "react";

import { SessionNoteScreen, SessionScreen } from "../components/pages";
import { Message, MessageKeys } from "../constants";
import { MaterialTabbarCommonOptions } from "./MaterialTabbarSettings";
//#endregion

//#region Component
const MaterialTab = createMaterialTopTabNavigator();

const SessionTabNavigator = (): JSX.Element => {
    return (
        <MaterialTab.Navigator tabBarOptions={MaterialTabbarCommonOptions}>
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

export default SessionTabNavigator;
//#endregion
