import { Platform, StyleSheet } from "react-native";

import { Colors, Dimens, Fonts, Layout } from "../constants";

export default StyleSheet.create({
    bgImage: {
        alignItems: "center",
        flex: 1,
        height: Layout.window.height,
        justifyContent: "center",
        left: 0,
        top: 0,
        width: Layout.window.width
    },
    centeredColumnList: {
        alignItems: "center",
        flex: 1,
        justifyContent: "space-evenly"
    },
    centeredContent: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
    },
    standardView: {
        alignItems: "center",
        backgroundColor: Colors.navy,
        marginLeft: Dimens.content_margin_horizontal,
        marginRight: Dimens.content_margin_horizontal,
        flex: 1,
        justifyContent: "space-between"
    },
    footerButton: {
        alignItems: "center",
        paddingBottom: 4
    },
    form: {
        borderColor: "white",
        borderRadius: 10,
        borderWidth: 1,
        justifyContent: "center",
        left: 10,
        position: "absolute",
        right: 10
    },
    headerStyle: {
        backgroundColor: Colors.navy
    },
    headerTitleStyle: {
        borderColor: Colors.blue,
        borderBottomWidth: 3,
        marginRight: Dimens.content_margin_horizontal
    },
    headerLeftContainerStyle: {
        width: Dimens.content_margin_horizontal
    },
    input: {
        borderBottomWidth: 1,
        borderColor: "white",
        borderWidth: 0,
        height: 40,
        marginLeft: 25,
        width: "85%"
    },
    rootContainer: {
        backgroundColor: Colors.navy,
        flex: 1
    }
});
