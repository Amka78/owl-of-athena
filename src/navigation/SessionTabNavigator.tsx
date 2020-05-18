//#region Import modules
import {
    NavigationParams,
    NavigationRoute,
    NavigationRouteConfigMap,
} from "react-navigation";
import {
    createMaterialTopTabNavigator,
    NavigationMaterialTabOptions,
    NavigationTabProp,
} from "react-navigation-tabs";
import { Colors, Message, MessageKeys } from "../constants";
import { SessionScreen, SessionNotesScreen } from "../screens";
//#endregion

//#region Route config
const routeConfigMap: NavigationRouteConfigMap<
    NavigationMaterialTabOptions,
    NavigationTabProp<NavigationRoute<NavigationParams>, any>
> = {
    Route1: {
        navigationOptions: {
            title: Message.get(MessageKeys.top_tab_sleep_tracking_title),
        },
        path: "",
        screen: SessionScreen,
    },
    Route2: {
        navigationOptions: {
            title: Message.get(MessageKeys.top_tab_journal_title),
        },
        path: "",
        screen: SessionNotesScreen,
    },
};
//#endregion

//#region Navigator
const SessionTabNavigator = createMaterialTopTabNavigator(routeConfigMap, {
    tabBarOptions: {
        activeTintColor: Colors.first_accent_color,
        inactiveTintColor: Colors.cyan,
        style: { backgroundColor: Colors.navy },
        pressColor: Colors.first_accent_color,
        labelStyle: { fontWeight: "bold" },
    },
});
//#endregion
export default SessionTabNavigator;
