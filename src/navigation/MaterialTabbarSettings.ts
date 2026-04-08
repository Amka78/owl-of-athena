import type { MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs";
//#region Import Modules
import { Colors } from "../constants";
//#endregion

//#region Settings
export const MaterialTabbarCommonOptions: MaterialTopTabNavigationOptions = {
    tabBarActiveTintColor: Colors.first_accent_color,
    tabBarInactiveTintColor: Colors.cyan,
    tabBarStyle: { backgroundColor: Colors.navy },
    tabBarPressColor: Colors.first_accent_color,
    tabBarLabelStyle: { fontWeight: "bold" },
};
//#endregion
