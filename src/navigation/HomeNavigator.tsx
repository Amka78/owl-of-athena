import * as React from "react";
import { Platform, View } from "react-native";
import {
    NavigationParams,
    NavigationRoute,
    NavigationRouteConfigMap
} from "react-navigation";
import {
    createStackNavigator,
    NavigationStackOptions,
    NavigationStackProp
} from "react-navigation-stack";

import { Colors, Message, MessageKeys } from "../constants";
import {
    AwakeScreen,
    HomeScreen,
    SettingsScreen,
    SleepingScreen,
    WakingScreen
} from "../screens";
import { CommonStyles } from "../styles";

const routeConfigMap: NavigationRouteConfigMap<
    NavigationStackOptions,
    NavigationStackProp<NavigationRoute<NavigationParams>, any>
> = {
    Awake: {
        path: "awake",
        screen: AwakeScreen,
        navigationOptions: {
            headerTitle: Message.get(MessageKeys.awake_title)
        }
    },
    Sleeping: {
        path: "sleeping",
        screen: SleepingScreen,
        navigationOptions: {
            headerTitle: Message.get(MessageKeys.sleeping_title)
        }
    },
    Settings: {
        path: "settings",
        screen: SettingsScreen,
        navigationOptions: {
            headerTitle: Message.get(MessageKeys.settings_title)
        }
    },
    Home: {
        path: "home",
        screen: HomeScreen,
        navigationOptions: {
            headerTitle: Message.get(MessageKeys.home_title)
        }
    },
    Waking: {
        path: "waking",
        screen: WakingScreen,
        navigationOptions: {
            headerTitle: Message.get(MessageKeys.waking_title)
        }
    },
    Logout: {
        screen: (): JSX.Element => <View></View>
    }
};

const HomeNavigator = createStackNavigator(routeConfigMap, {
    defaultNavigationOptions: () => {
        return {
            headerLeft: (): JSX.Element => <View></View>,
            headerTitleAlign: "center",
            headerTintColor: Colors.cyan,
            headerStyle: CommonStyles.headerStyle,
            headerTitleContainerStyle: CommonStyles.headerTitleContainerStyle
        };
    },
    headerMode: Platform.OS === "web" ? "screen" : "float",
    initialRouteName: "Home"
});

export default HomeNavigator;
