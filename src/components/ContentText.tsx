//#region Import Modules
import React, { FunctionComponent } from "react";
import { Text, TextStyle } from "react-native";
import { Colors, Dimens, Fonts } from "../constants";
//#endregion

//#region Types
export type ContentTextProps = {
    children: string;
    onPress?: () => void;
    style?: TextStyle;
};
//#endregion

//#region Component
export const ContentText: FunctionComponent<ContentTextProps> = (
    props: ContentTextProps
) => {
    return (
        <Text style={[textStyle, props.style]} onPress={props.onPress}>
            {props.children}
        </Text>
    );
};
//#endregion

//#region Styles
const textStyle: TextStyle = {
    color: Colors.cyan,
    fontFamily: Fonts.primaryRegular,
    fontSize: Dimens.content_text_size,
    flex: 1,
};
//#endregion
