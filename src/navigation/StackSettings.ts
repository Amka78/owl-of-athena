//#region Import Modules
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Colors } from "../constants";
import { headerStyle } from "./HeaderStyles";
//#endregion

//#region Settings
export const StackCommonScreenOptions: NativeStackNavigationOptions = {
    headerTitleAlign: "center",
    headerTintColor: Colors.cyan,
    headerStyle: headerStyle,
    headerTitle: "",
    headerShadowVisible: false,
};
//#endregion
