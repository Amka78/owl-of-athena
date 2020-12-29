import React from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import {
    NavigationParams,
    NavigationRoute,
    NavigationRouteConfigMap,
} from "react-navigation";
import {
    createBottomTabNavigator,
    NavigationBottomTabOptions,
    NavigationTabProp,
} from "react-navigation-tabs";

import { Colors } from "../constants";
import HomeNavigator from "./HomeNavigator";
import SessionNavigator from "./SessionNavigator";
import SettingNavigator from "./SettingNavigator";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { ButtonComponentProps } from "react-navigation-tabs/lib/typescript/src/types";

const routeConfigMap: NavigationRouteConfigMap<
    NavigationBottomTabOptions,
    NavigationTabProp<NavigationRoute<NavigationParams>, any>
> = {
    Route1: {
        navigationOptions: {
            title: "",
            tabBarButtonComponent: (props: ButtonComponentProps) =>
                createTabBarIcon(props, "alarm-check"),
        },
        path: "",
        screen: HomeNavigator,
    },
    Route2: {
        navigationOptions: {
            title: "",
            tabBarButtonComponent: (props: ButtonComponentProps) =>
                createTabBarIcon(props, "blur"),
        },
        path: "sessions",
        screen: SessionNavigator,
    },
    Route3: {
        navigationOptions: {
            title: "",
            tabBarButtonComponent: (props: ButtonComponentProps) =>
                createTabBarIcon(props, "settings"),
        },
        path: "account-settings",
        screen: SettingNavigator,
    },
};

const MainTabNavigator = createBottomTabNavigator(routeConfigMap, {
    tabBarOptions: {
        activeTintColor: Colors.cyan,
        inactiveTintColor: Colors.white,
        tabStyle: { backgroundColor: Colors.navy_darker },
    },
});

export default MainTabNavigator;

function createTabBarIcon(
    props: ButtonComponentProps,
    iconImagePath: string
): JSX.Element {
    return (
        <View
            style={{
                backgroundColor: Colors.navy_darker,
                flex: 1,
                justifyContent: "center",
            }}
        >
            <TouchableWithoutFeedback
                style={{ flex: 1 }}
                onPress={props.onPress}
            >
                <IconButton
                    icon={iconImagePath}
                    onPress={props.onPress}
                    style={{
                        alignSelf: "center",
                    }}
                    color={props.focused ? Colors.cyan : Colors.white}
                >
                    {""}
                </IconButton>
            </TouchableWithoutFeedback>
        </View>
    );
}
