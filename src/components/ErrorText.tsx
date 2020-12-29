//#region Import Modules
import React, { FunctionComponent } from "react";
import { StyleSheet, Text, TextStyle } from "react-native";

import { Colors, Dimens, Fonts } from "../constants";
//#endregion

//#region Types
export type ErrorTextProps = {
    children?: string;
    style?: TextStyle;
};
//#endregion

//#region Component
export const ErrorText: FunctionComponent<ErrorTextProps> = (
    props: ErrorTextProps
) => {
    return <Text style={createTextStyle(props.style)}>{props.children}</Text>;
};
//#endregion

//#region Styles
const textStyle: TextStyle = {
    color: Colors.red,
    fontFamily: Fonts.primaryRegular,
    fontSize: Dimens.error_text_size,
    marginBottom: Dimens.error_text_margin_bottom,
};
//#endregion

function createTextStyle(propsStyle?: TextStyle): TextStyle {
    return StyleSheet.flatten([propsStyle, textStyle]);
}
