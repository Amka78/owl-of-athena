import React, { FunctionComponent, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
    Colors,
    Message,
    MessageLocalizationParam,
    Dimens,
    Fonts,
    Layout
} from "../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

type LabeledSelectorMenuProps = {
    value: string;
    label: MessageLocalizationParam;
    children?: JSX.Element;
    onPress?: () => void;
};
export const LabeledSelectorMenu: FunctionComponent<LabeledSelectorMenuProps> = (
    props: LabeledSelectorMenuProps
) => {
    return (
        <TouchableOpacity style={style.container} onPress={props.onPress}>
            <Text style={style.label}>{Message.get(props.label)}</Text>
            <View style={style.optionContainer}>
                <Text style={style.option}>{props.value}</Text>
                <MaterialCommunityIcons
                    name={"chevron-right"}
                    color={Colors.purple}
                    size={20}
                    style={{
                        marginLeft: 0
                    }}
                ></MaterialCommunityIcons>
            </View>
            {props.children}
        </TouchableOpacity>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: Layout.window.fixedWidth - Dimens.content_margin_horizontal * 2
    },
    label: {
        color: Colors.cyan,
        flex: 1,
        marginBottom: Dimens.option_margin_bottom,
        fontFamily: Fonts.primaryRegular,
        fontSize: Dimens.option_text_size
    },
    option: {
        color: Colors.purple,
        flex: 1,
        marginLeft: 0,
        marginBottom: Dimens.option_margin_bottom
    },
    optionContainer: {
        flexDirection: "row",
        marginBottom: Dimens.option_margin_bottom
    }
});
