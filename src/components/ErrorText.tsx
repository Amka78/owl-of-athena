import React, { FunctionComponent } from "react";
import { StyleSheet, Text, TextStyle } from "react-native";

import { Colors, Dimens, Fonts, Message } from "../constants";
import { MessageLocalizationParam } from "../constants/Message";

type ErrorTextProps = {
    children: MessageLocalizationParam;
    style?: TextStyle;
};
export const ErrorText: FunctionComponent<ErrorTextProps> = (
    props: ErrorTextProps
) => {
    return (
        <Text style={createTextStyle(props.style)}>
            {Message.get(props.children.key, props.children.restParam)}
        </Text>
    );
};
const textStyle: TextStyle = {
    color: Colors.red,
    fontFamily: Fonts.primaryRegular,
    fontSize: Dimens.error_text_size,
    marginBottom: Dimens.error_text_margin_bottom
};

function createTextStyle(propsStyle?: TextStyle): TextStyle {
    return StyleSheet.flatten([propsStyle, textStyle]);
}
