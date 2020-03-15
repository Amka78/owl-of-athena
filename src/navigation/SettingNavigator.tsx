import * as React from "react";
import { Platform } from "react-native";
import {
    NavigationParams,
    NavigationRoute,
    NavigationRouteConfigMap
    // NavigationScreenConfigProps
} from "react-navigation";
import {
    createStackNavigator,
    HeaderBackButtonProps,
    NavigationStackOptions,
    NavigationStackProp
} from "react-navigation-stack";

import { HeaderBackButton } from "../components";
import { Dimens, Message, MessageKeys, Colors } from "../constants";
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
            headerTitle: Message.get(MessageKeys.account_title),
            headerTitleContainerStyle: {
                ...CommonStyles.headerTitleContainerStyle,
                marginLeft: Dimens.content_margin_horizontal
            }
        }
    }
};

const SettingNavigator = createStackNavigator(routeConfigMap, {
    defaultNavigationOptions: () => {
        return {
            headerLeft: (props: HeaderBackButtonProps): JSX.Element => (
                <HeaderBackButton {...props} />
            ),
            headerStyle: CommonStyles.headerStyle,
            headerTintColor: Colors.cyan,
            headerTitleContainerStyle: CommonStyles.headerTitleContainerStyle,
            headerLeftContainerStyle: CommonStyles.headerLeftContainerStyle
        };
    },
    headerMode: Platform.OS === "web" ? "screen" : "float",
    initialRouteName: "Account"
});

export default SettingNavigator;
