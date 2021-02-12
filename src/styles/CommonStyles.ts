//#region Import modules
import { StyleSheet } from "react-native";

import { Colors, Dimens } from "../constants";
//#endregion

//#retgion StyleSheet
export default StyleSheet.create({
    standardView: {
        alignItems: "center",
        marginLeft: Dimens.content_margin_horizontal,
        marginRight: Dimens.content_margin_horizontal,
        flex: 1,
        justifyContent: "space-between",
    },
    headerStyle: {
        backgroundColor: Colors.navy,
        borderBottomColor: Colors.white,
        borderBottomWidth: 1,
    },
    rootContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
//#endregion
