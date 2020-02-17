import * as React from "react";
import { Platform } from "react-native";
import {
    NavigationParams,
    NavigationRoute,
    NavigationRouteConfigMap
    //NavigationScreenConfigProps
} from "react-navigation";
import {
    createStackNavigator,
    HeaderBackButtonProps,
    NavigationStackOptions,
    NavigationStackProp
} from "react-navigation-stack";

import { HeaderBackButton } from "../components";
import { Dimens } from "../constants";
import { LoginScreen, SignupScreen, WelcomeScreen } from "../screens";
import { CommonStyles } from "../styles";
import { ForgotPasswordScreen } from "../screens/ForgotPassswordScreen";

const routeConfigMap: NavigationRouteConfigMap<
    NavigationStackOptions,
    NavigationStackProp<NavigationRoute<NavigationParams>, any>
> = {
    ForgotPassword: {
        path: "forgot-password",
        screen: ForgotPasswordScreen
    },
    Signup: {
        path: "signup",
        screen: SignupScreen
    },
    Login: {
        path: "login",
        screen: LoginScreen
    },
    Welcome: {
        path: "",
        screen: WelcomeScreen,
        navigationOptions: {
            headerLeft: undefined,
            headerTitleContainerStyle: {
                ...CommonStyles.headerTitleContainerStyle,
                marginLeft: Dimens.content_margin_horizontal
            }
        }
    }
};

const UnauthenticatedNavigator = createStackNavigator(routeConfigMap, {
    defaultNavigationOptions: () =>
        /*configProps: NavigationScreenConfigProps<
            NavigationStackProp<NavigationRoute<NavigationParams>>
        >*/
        {
            return {
                headerLeft: (props: HeaderBackButtonProps) => (
                    <HeaderBackButton {...props} />
                ),
                headerStyle: CommonStyles.headerStyle,
                headerTitleContainerStyle:
                    CommonStyles.headerTitleContainerStyle,
                headerLeftContainerStyle: CommonStyles.headerLeftContainerStyle
            };
        },
    headerMode: Platform.OS === "web" ? "screen" : "float",
    initialRouteName: "Welcome"
});

export default UnauthenticatedNavigator;
