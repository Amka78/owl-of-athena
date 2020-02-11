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
import { Colors, Dimens, Message } from "../constants";
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
        path: "",
        screen: AwakeScreen,
        navigationOptions: {
            headerTitle: Message.get("awake_title")
        }
    },
    Sleeping: {
        path: "",
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
        path: "",
        screen: HomeScreen,
        navigationOptions: {
            headerLeft: undefined,
            headerTitle: Message.get("home_title"),
            headerTitleContainerStyle: {
                ...CommonStyles.headerTitleContainerStyle,
                marginLeft: Dimens.content_margin_horizontal
            }
        }
    },
    Waking: {
        path: "",
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
                headerLeft: (props: HeaderBackButtonProps) => (
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
