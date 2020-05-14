import * as React from "react";
import { Platform } from "react-native";
import {
    NavigationParams,
    NavigationRoute,
    NavigationRouteConfigMap,
} from "react-navigation";
import {
    createStackNavigator,
    StackHeaderLeftButtonProps,
    NavigationStackOptions,
    NavigationStackProp,
} from "react-navigation-stack";

import { IconButton } from "react-native-paper";
import { HeaderBackButton } from "../components";
import { Dimens, Message, MessageKeys, Colors } from "../constants";
import { SessionListScreen } from "../screens";
import { CommonStyles } from "../styles";
import SessionTabNavigator from "./SessionTabNavigator";
const routeConfigMap: NavigationRouteConfigMap<
    NavigationStackOptions,
    NavigationStackProp<NavigationRoute<NavigationParams>, any>
> = {
    List: {
        path: "",
        screen: SessionListScreen,
        navigationOptions: ({ navigation }): any => {
            const { params } = navigation.state;
            return {
                headerLeft: (
                    props: StackHeaderLeftButtonProps
                ): React.ReactNode => {
                    return (
                        <IconButton
                            {...props}
                            icon={"refresh"}
                            size={40}
                            color={Colors.white}
                            onPress={(): void => {
                                if (params.onPressedRefresh) {
                                    params.onPressedRefresh();
                                }
                            }}
                        ></IconButton>
                    );
                },
                headerRight: (
                    props: StackHeaderLeftButtonProps
                ): React.ReactNode => {
                    return (
                        <IconButton
                            {...props}
                            icon={"filter-variant"}
                            size={40}
                            color={Colors.white}
                            onPress={(): void => {
                                if (params.onPressedFilter) {
                                    params.onPressedFilter();
                                }
                            }}
                        ></IconButton>
                    );
                },
                headerTitle: Message.get(MessageKeys.session_list_title),
                headerTitleContainerStyle: {
                    ...CommonStyles.headerTitleContainerStyle,
                    marginLeft: Dimens.content_margin_horizontal,
                },
                title: params ? params.sessionTitle : "Detail",
            };
        },
    },
    Detail: {
        path: "",
        screen: SessionTabNavigator,
        navigationOptions: ({ navigation }): any => {
            const { params } = navigation.state;
            return {
                title: params ? params.sessionTitle : "Detail",
            };
        },
    },
};

const SessionNavigator = createStackNavigator(routeConfigMap, {
    defaultNavigationOptions: () => {
        return {
            headerLeft: (props: StackHeaderLeftButtonProps): JSX.Element => (
                <HeaderBackButton {...props} />
            ),
            headerTitleAlign: "center",
            headerTintColor: Colors.cyan,
            headerStyle: CommonStyles.headerStyle,
            headerTitleContainerStyle: CommonStyles.headerTitleContainerStyle,
            headerLeftContainerStyle: CommonStyles.headerLeftContainerStyle,
        };
    },
    headerMode: Platform.OS === "web" ? "screen" : "float",
    initialRouteName: "List",
});

export default SessionNavigator;
