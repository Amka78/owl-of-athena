//#region Import modules
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as React from "react";

import { ProfilePreviewScreen, ProfileScreen } from "../components/pages";
import { Message, MessageKeys } from "../constants";
import { MaterialTabbarCommonOptions } from "./MaterialTabbarSettings";
//#endregion

//#region Component
const MaterialTab = createMaterialTopTabNavigator();

const ProfileTabNavigator = (): JSX.Element => {
    return (
        <MaterialTab.Navigator tabBarOptions={MaterialTabbarCommonOptions}>
            <MaterialTab.Screen
                name={"Edit"}
                component={ProfileScreen}
                options={{
                    title: Message.get(MessageKeys.top_tab_profile_edit_title),
                }}
            ></MaterialTab.Screen>
            <MaterialTab.Screen
                name={"Preview"}
                component={ProfilePreviewScreen}
                options={{
                    title: Message.get(
                        Message.get(MessageKeys.top_tab_profile_preview_title)
                    ),
                }}
            ></MaterialTab.Screen>
        </MaterialTab.Navigator>
    );
};
//#endregion

export default ProfileTabNavigator;
