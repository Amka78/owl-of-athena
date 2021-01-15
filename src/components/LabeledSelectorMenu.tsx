//#region Import Modules
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { FunctionComponent } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Colors, Dimens, Fonts } from "../constants";
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
        <View style={style.container}>
            <TouchableOpacity
                style={style.tochableOpacity}
                onPress={props.onPress}
            >
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
        </View>
    );
};
//#endregion

//#region Styles
const style = StyleSheet.create({
    container: {
        //flex: 1,
    },
    tochableOpacity: {
        flexDirection: "row",
        alignItems: Platform.OS !== "web" ? "center" : undefined,
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
        marginLeft: 0,
    },
    optionContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: Dimens.option_margin_bottom,
    },
});
//#endregion
