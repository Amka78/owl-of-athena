//#region Import Modules
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Colors, Dimens, Fonts, Layout } from "../constants";
//#endregion

//#region Types
export type LabeledSelectorMenuProps = {
    value: string;
    label: string;
    onPress?: () => void;
};
//#endregion

//#region Component
export const LabeledSelectorMenu: FunctionComponent<LabeledSelectorMenuProps> = (
    props: LabeledSelectorMenuProps
) => {
    return (
        <TouchableOpacity style={style.container} onPress={props.onPress}>
            <Text style={style.label}>{props.label}</Text>
            <View style={style.optionContainer}>
                <Text style={style.option}>{props.value}</Text>
                <MaterialCommunityIcons
                    name={"chevron-right"}
                    color={Colors.purple}
                    size={20}
                    style={{
                        marginLeft: 0,
                    }}
                ></MaterialCommunityIcons>
            </View>
        </TouchableOpacity>
    );
};
//#endregion

//#region Styles
const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: Layout.window.fixedWidth - Dimens.content_margin_horizontal * 2,
    },
    label: {
        color: Colors.cyan,
        flex: 1,
        marginBottom: Dimens.option_margin_bottom,
        fontFamily: Fonts.primaryRegular,
        fontSize: Dimens.option_text_size,
    },
    option: {
        color: Colors.purple,
        flex: 1,
        marginLeft: 0,
        marginBottom: Dimens.option_margin_bottom,
    },
    optionContainer: {
        flexDirection: "row",
        marginBottom: Dimens.option_margin_bottom,
    },
});
//#endregion
