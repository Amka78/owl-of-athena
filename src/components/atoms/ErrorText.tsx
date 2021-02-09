//#region Import Modules
import React, { FunctionComponent } from "react";
import { Text, TextStyle } from "react-native";
import { useTheme } from "react-native-paper";

import { Dimens, Fonts } from "../../constants";
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
    const theme = useTheme();
    return (
        <Text style={[textStyle, { color: theme?.colors?.error }, props.style]}>
            {props.children}
        </Text>
    );
};
//#endregion

//#region Styles
const textStyle: TextStyle = {
    fontFamily: Fonts.primaryRegular,
    fontSize: Dimens.error_text_size,
    marginBottom: Dimens.error_text_margin_bottom,
};
//#endregion
