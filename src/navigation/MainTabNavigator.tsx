//#region Import Modules
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { Colors } from "../constants";
import HomeNavigator from "./HomeNavigator";
import SessionNavigator from "./SessionNavigator";
import SettingNavigator from "./SettingNavigator";
//#endregion

//#region Component
const BottomTab = createBottomTabNavigator();

const MainTabNavigator = (): JSX.Element => {
    return (
        <BottomTab.Navigator
            initialRouteName={"Home"}
            tabBarOptions={{
                activeTintColor: Colors.cyan,
                inactiveTintColor: Colors.white,
                tabStyle: { backgroundColor: Colors.navy_darker },
            }}
        >
            <BottomTab.Screen
                name="Home"
                component={HomeNavigator}
                options={{
                    title: "",
                    tabBarIcon: getTabBarIcon("alarm-check"),
                }}
            ></BottomTab.Screen>
            <BottomTab.Screen
                name="Session"
                component={SessionNavigator}
                options={{
                    title: "",
                    tabBarIcon: getTabBarIcon("blur"),
                }}
            ></BottomTab.Screen>
            <BottomTab.Screen
                name="Settings"
                component={SettingNavigator}
                options={{
                    title: "",
                    tabBarIcon: getTabBarIcon("cog"),
                }}
            ></BottomTab.Screen>
        </BottomTab.Navigator>
    );
};
//#endregion

//#region Function
const getTabBarIcon = (name: string) => ({
    color,
    size,
}: {
    color: string;
    size: number;
}) => <MaterialCommunityIcons name={name} color={color} size={size} />;
//#endregion

export default MainTabNavigator;
