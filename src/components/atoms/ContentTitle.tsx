//#region Import Modules
import { useTheme } from "react-native-paper";
import React, { FunctionComponent } from "react";
import { Text, StyleProp, TextStyle } from "react-native";
import { Dimens, Fonts } from "../../constants";
//#endregion

//#region Types
export type ContentTitleProps = {
    children: string;
    style?: StyleProp<TextStyle>;
};
//#endregion

//#region Conponent
export const ContentTitle: FunctionComponent<ContentTitleProps> = (
    props: ContentTitleProps
) => {
    const theme = useTheme();
    return (
        <Text
            style={[textStyle, { color: theme?.colors?.accent }, props.style]}
        >
            {props.children}
        </Text>
    );
};
//#endregion

//#region Styles
const textStyle: TextStyle = {
    fontFamily: Fonts.primaryRegular,
    fontSize: Dimens.content_title_text_size,
    marginTop: Dimens.content_title_margin_top,
    marginBottom: Dimens.content_title_margin_bottom,
};
//#endregion
