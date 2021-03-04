//#region Import Modules
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import { HomeIcon, SessionsIcon, SettingsIcon } from "../components/atoms";
import { SessionDesktopScreen } from "../components/pages";
import { Colors } from "../constants";
import { useWindowDimensions } from "../hooks";
import HomeNavigator from "./HomeNavigator";
import SessionNavigator from "./SessionNavigator";
import SettingNavigator from "./SettingNavigator";
//#endregion

//#region Types
type TabBarIconProps = { focused: boolean; size: number; color: string };
//#endregion
//#region Component
const BottomTab = createBottomTabNavigator();

const MainTabNavigator = (): JSX.Element => {
    const dimens = useWindowDimensions();
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
                    tabBarIcon: (props: TabBarIconProps) => {
                        return <HomeIcon {...props}></HomeIcon>;
                    },
                }}
            ></BottomTab.Screen>
            <BottomTab.Screen
                name="Sessions"
                component={
                    dimens.isDesktop ? SessionDesktopScreen : SessionNavigator
                }
                options={{
                    title: "",
                    tabBarIcon: (props: TabBarIconProps) => {
                        return <SessionsIcon {...props}></SessionsIcon>;
                    },
                }}
            ></BottomTab.Screen>
            <BottomTab.Screen
                name="Settings"
                component={SettingNavigator}
                options={{
                    title: "",
                    tabBarIcon: (props: TabBarIconProps) => {
                        return <SettingsIcon {...props}></SettingsIcon>;
                    },
                }}
            ></BottomTab.Screen>
        </BottomTab.Navigator>
    );
};
//#endregion

export default MainTabNavigator;
