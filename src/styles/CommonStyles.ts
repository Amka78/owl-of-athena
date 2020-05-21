//#region Import modules
import { StyleSheet } from "react-native";

import { Colors, Dimens } from "../constants";
//#endregion

//#retgion StyleSheet
export default StyleSheet.create({
    standardView: {
        alignItems: "center",
        backgroundColor: Colors.navy,
        marginLeft: Dimens.content_margin_horizontal,
        marginRight: Dimens.content_margin_horizontal,
        flex: 1,
        justifyContent: "space-between",
    },
    headerStyle: {
        backgroundColor: Colors.navy,
    },
    headerTitleContainerStyle: {
        alignContent: "center",
        borderColor: Colors.blue,
        borderBottomWidth: 3,
        justifyContent: "center",
        marginRight: Dimens.content_margin_horizontal,
    },
    headerLeftContainerStyle: {
        width: Dimens.content_margin_horizontal,
    },
    rootContainer: {
        backgroundColor: Colors.navy,
        flex: 1,
    },
});
//#endregion
