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
import { AccountScreen } from "../screens";
import { CommonStyles } from "../styles";

const routeConfigMap: NavigationRouteConfigMap<
    NavigationStackOptions,
    NavigationStackProp<NavigationRoute<NavigationParams>, any>
> = {
    Account: {
        path: "",
        screen: AccountScreen,
        navigationOptions: {
            headerLeft: undefined,
            headerTitleContainerStyle: {
                ...CommonStyles.headerTitleStyle,
                marginLeft: Dimens.content_margin_horizontal
            }
        }
    }
};

const SettingNavigator = createStackNavigator(routeConfigMap, {
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
    initialRouteName: "Account"
});

export default SettingNavigator;
