//#region Import Modules
import React, { FunctionComponent } from "react";
import { Text, StyleSheet, TextStyle } from "react-native";
import { Colors, Dimens, Fonts } from "../constants";
//#endregion

//#region Types
export type ContentTitleProps = {
    children: string;
    style?: TextStyle;
};
//#endregion

//#region Conponent
export const ContentTitle: FunctionComponent<ContentTitleProps> = (
    props: ContentTitleProps
) => {
    return <Text style={createTextStyle(props.style)}>{props.children}</Text>;
};
//#endregion

//#region Styles
const textStyle: TextStyle = {
    color: Colors.cyan,
    fontFamily: Fonts.primaryRegular,
    fontSize: Dimens.content_title_text_size,
    marginTop: Dimens.content_title_margin_top,
    marginBottom: Dimens.content_title_margin_bottom,
};
//#endregion

function createTextStyle(propsStyle?: TextStyle): TextStyle {
    return StyleSheet.flatten([propsStyle, textStyle]);
}
