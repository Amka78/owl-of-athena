import {
    createSwitchNavigator,
    NavigationRoute,
    NavigationRouteConfigMap,
    NavigationSwitchRouterConfig,
    NavigationSwitchProp,
    CreateNavigatorConfig
} from "react-navigation";

import UnauthenticatedNavigator from "./UnauthenticatedNavigator";
import MainTabNavigator from "./MainTabNavigator";

const routeConfitMap: NavigationRouteConfigMap<
    {},
    NavigationSwitchProp<NavigationRoute>
> = {
    Main: {
        path: "",
        screen: MainTabNavigator
    },
    Unauthenticated: {
        path: "",
        screen: UnauthenticatedNavigator
    }
};

const stackConfig: CreateNavigatorConfig<
    {},
    NavigationSwitchRouterConfig,
    {},
    NavigationSwitchProp
> = {
    initialRouteName: "Unauthenticated"
};

const InitialNavigator = createSwitchNavigator(routeConfitMap, stackConfig);

export default InitialNavigator;
