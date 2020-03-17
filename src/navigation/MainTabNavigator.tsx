import React from "react";
import { Button } from "react-native-paper";
import {
    NavigationParams,
    NavigationRoute,
    NavigationRouteConfigMap
} from "react-navigation";
import {
    createBottomTabNavigator,
    NavigationBottomTabOptions,
    NavigationTabProp
} from "react-navigation-tabs";

import { Colors } from "../constants";
import HomeNavigator from "./HomeNavigator";
import SessionNavigator from "./SessionNavigator";
import SettingNavigator from "./SettingNavigator";
import { Platform } from "react-native";

const routeConfigMap: NavigationRouteConfigMap<
    NavigationBottomTabOptions,
    NavigationTabProp<NavigationRoute<NavigationParams>, any>
> = {
    Route1: {
        navigationOptions: {
            tabBarIcon: (options): JSX.Element =>
                createTabBarIcon(options, "alarm-check"),
            title: ""
        },
        path: "",
        screen: HomeNavigator
    },
    Route2: {
        navigationOptions: {
            tabBarIcon: (options): JSX.Element =>
                createTabBarIcon(options, "blur"),
            title: ""
        },
        path: "sessions",
        screen: SessionNavigator
    },
    Route3: {
        navigationOptions: {
            tabBarIcon: (options): JSX.Element =>
                createTabBarIcon(options, "settings"),
            title: ""
        },
        path: "account-settings",
        screen: SettingNavigator
    }
};

const bottomTabNavigationConfig = {
    tabBarOptions: {
        activeTintColor: Colors.cyan,
        inactiveTintColor: Colors.navy_darker,
        style: { backgroundColor: Colors.navy }
    }
};

const MainTabNavigator = createBottomTabNavigator(
    routeConfigMap,
    bottomTabNavigationConfig
);

export default MainTabNavigator;

function createTabBarIcon(
    options: { focused: boolean; tintColor?: string; horizontal?: boolean },
    iconImagePath: string
): JSX.Element {
    return (
        <Button
            style={{
                height: 15,
                width: 15
            }}
            icon={iconImagePath}
            theme={{ colors: { primary: options.tintColor } }}
        >
            {""}
        </Button>
    );
}
