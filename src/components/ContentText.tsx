import React, { FunctionComponent } from "react";
import { Text, StyleSheet, TextStyle } from "react-native";
import {
    MessageLocalizationParam,
    Message,
    Colors,
    Dimens,
    Fonts
} from "../constants";

type ContentTextProps = {
    children: MessageLocalizationParam;
    style?: TextStyle;
};
export const ContentText: FunctionComponent<ContentTextProps> = (
    props: ContentTextProps
) => {
    return (
        <Text style={createTextStyle(props.style)}>
            {Message.get(props.children)}
        </Text>
    );
};
const textStyle: TextStyle = {
    color: Colors.cyan,
    fontFamily: Fonts.primaryRegular,
    fontSize: Dimens.content_text_size,
    flex: 1
};
function createTextStyle(propsStyle?: TextStyle) {
    return StyleSheet.flatten([propsStyle, textStyle]);
}
