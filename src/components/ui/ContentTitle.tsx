//#region Import Modules

import React, { type FunctionComponent } from "react";
import { type StyleProp, Text, type TextStyle } from "react-native";
import { useTheme } from "react-native-paper";
import { Dimens, Fonts } from "../../constants";
//#endregion

//#region Types
export type ContentTitleProps = {
    children: string;
    style?: StyleProp<TextStyle>;
};
//#endregion

//#region Conponent
export const ContentTitle: FunctionComponent<ContentTitleProps> = (props: ContentTitleProps) => {
    const theme = useTheme();
    return (
        <Text style={[textStyle, { color: theme?.colors?.secondary }, props.style]}>
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
