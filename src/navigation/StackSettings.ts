//#region Import Modules
import { StackNavigationOptions } from "@react-navigation/stack";
import { Colors } from "../constants";
import { headerStyle } from "./HeaderStyles";
//#endregion

//#region Settings
export const StackCommonScreenOptions: StackNavigationOptions = {
    headerTitleAlign: "center",
    headerTintColor: Colors.cyan,
    headerStyle: headerStyle,
    headerTitle: "",
};
//#endregion
