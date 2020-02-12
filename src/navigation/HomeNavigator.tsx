import * as React from "react";
import { Platform } from "react-native";
import {
    NavigationParams,
    NavigationRoute,
    NavigationRouteConfigMap
} from "react-navigation";
import {
    createStackNavigator,
    HeaderBackButtonProps,
    NavigationStackOptions,
    NavigationStackProp
} from "react-navigation-stack";

import { HeaderBackButton } from "../components";
import { Colors, Message } from "../constants";
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
            headerTitle: Message.get("awake_title")
        }
    },
    Sleeping: {
        path: "sleeping",
        screen: SleepingScreen,
        navigationOptions: {
            headerTitle: Message.get("sleeping_title")
        }
    },
    Settings: {
        path: "",
        screen: SettingsScreen,
        navigationOptions: {
            headerTitle: Message.get("settings_title")
        }
    },
    Home: {
        path: "home",
        screen: HomeScreen,
        navigationOptions: {
            headerLeft: undefined,
            headerTitle: Message.get("home_title")
        }
    },
    Waking: {
        path: "waking",
        screen: WakingScreen,
        navigationOptions: {
            headerTitle: Message.get("waking_title")
        }
    }
};

const HomeNavigator = createStackNavigator(routeConfigMap, {
    defaultNavigationOptions: () =>
        /*configProps: NavigationScreenConfigProps<
            NavigationStackProp<NavigationRoute<NavigationParams>>
        >*/
        {
            return {
                headerLeft: (props: HeaderBackButtonProps): JSX.Element => (
                    <HeaderBackButton {...props} />
                ),
                headerTintColor: Colors.cyan,
                headerStyle: CommonStyles.headerStyle,
                headerTitleContainerStyle:
                    CommonStyles.headerTitleContainerStyle,
                headerLeftContainerStyle: CommonStyles.headerLeftContainerStyle
            };
        },
    headerMode: Platform.OS === "web" ? "screen" : "float",
    initialRouteName: "Home"
});

export default HomeNavigator;
