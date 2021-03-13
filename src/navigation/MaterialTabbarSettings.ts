import { MaterialTopTabBarOptions } from "@react-navigation/material-top-tabs";
//#region Import Modules
import { Colors } from "../constants";
//#endregion

//#region Settings
export const MaterialTabbarCommonOptions: MaterialTopTabBarOptions = {
    activeTintColor: Colors.first_accent_color,
    inactiveTintColor: Colors.cyan,
    style: { backgroundColor: Colors.navy },
    pressColor: Colors.first_accent_color,
    labelStyle: { fontWeight: "bold" },
};
//#endregion
