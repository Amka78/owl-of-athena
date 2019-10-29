import * as React from "react";
import { Platform } from "react-native";
import {
    NavigationParams,
    NavigationRoute,
    NavigationRouteConfigMap,
    NavigationScreenConfigProps
} from "react-navigation";
import {
    createStackNavigator,
    HeaderBackButtonProps,
    NavigationStackOptions,
    NavigationStackProp
} from "react-navigation-stack";

import { HeaderBackButton } from "../components";
import { Dimens } from "../constants";
import {
    LoginScreen,
    SettingsScreen,
    SignupScreen,
    WelcomeScreen,
    HomeScreen,
    AwakeScreen,
    SleepingScreen,
    WakingScreen
} from "../screens";
import { CommonStyles } from "../styles";
import { ForgotPasswordScreen } from "../screens/ForgotPassswordScreen";

const routeConfigMap: NavigationRouteConfigMap<
    NavigationStackOptions,
    NavigationStackProp<NavigationRoute<NavigationParams>, any>
> = {
    Awake: {
        path: "",
        screen: AwakeScreen
    },
    Sleeping: {
        path: "",
        screen: SleepingScreen
    },
    Setting: {
        path: "",
        screen: SettingsScreen
    },
    Home: {
        path: "",
        screen: HomeScreen,
        navigationOptions: {
            headerLeft: undefined,
            headerTitleContainerStyle: {
                ...CommonStyles.headerTitleStyle,
                marginLeft: Dimens.content_margin_horizontal
            }
        }
    },
    Waking: {
        path: "",
        screen: WakingScreen
    }
};

const HomeNavigator = createStackNavigator(routeConfigMap, {
    defaultNavigationOptions: (
        configProps: NavigationScreenConfigProps<
            NavigationStackProp<NavigationRoute<NavigationParams>>
        >
    ) => {
        return {
            headerLeft: (props: HeaderBackButtonProps) => (
                <HeaderBackButton {...props} />
            ),
            headerStyle: CommonStyles.headerStyle,
            headerTitleContainerStyle: CommonStyles.headerTitleStyle,
            headerLeftContainerStyle: CommonStyles.headerLeftContainerStyle
        };
    },
    headerMode: Platform.OS === "web" ? "screen" : "float",
    initialRouteName: "Home"
});

export default HomeNavigator;
