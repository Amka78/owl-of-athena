//#region Import Modules
import { StackNavigationOptions } from "@react-navigation/stack";
import { Colors } from "../constants";
import { CommonStyles } from "../styles";
//#endregion

//#region Settings
export const StackCommonScreenOptions: StackNavigationOptions = {
    headerTitleAlign: "center",
    headerTintColor: Colors.cyan,
    headerStyle: CommonStyles.headerStyle,
    headerTitle: "",
};
//#endregion
