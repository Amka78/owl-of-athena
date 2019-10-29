import React, { FunctionComponent } from "react";
import { Text, StyleSheet, TextStyle } from "react-native";
import {
    MessageLocalizationParam,
    Message,
    Colors,
    Dimens,
    Fonts
} from "../constants";

type ContentTitleProps = {
    children: MessageLocalizationParam;
    style?: TextStyle;
};
export const ContentTitle: FunctionComponent<ContentTitleProps> = (
    props: ContentTitleProps
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
    fontSize: Dimens.content_title_text_size,
    marginTop: Dimens.content_title_margin_top,
    marginBottom: Dimens.content_title_margin_bottom
};
function createTextStyle(propsStyle?: TextStyle) {
    return StyleSheet.flatten([propsStyle, textStyle]);
}
