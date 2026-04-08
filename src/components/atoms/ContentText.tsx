//#region Import Modules
import React, { type FunctionComponent } from "react";
import { Text, type TextStyle } from "react-native";
import { useTheme } from "react-native-paper";
import { Dimens, Fonts } from "../../constants";
import type { ThemeType } from "../../constants/Theme";
//#endregion

//#region Types
export type ContentTextProps = {
    children: string;
    onPress?: () => void;
    style?: TextStyle;
};
//#endregion

//#region Component
export const ContentText: FunctionComponent<ContentTextProps> = (props: ContentTextProps) => {
    const theme: ThemeType | undefined = useTheme();

    return (
        <Text
            style={[textStyle, { color: theme?.colors?.secondary }, props.style]}
            onPress={props.onPress}
        >
            {props.children}
        </Text>
    );
};
//#endregion

//#region Styles
const textStyle: TextStyle = {
    fontFamily: Fonts.primaryRegular,
    fontSize: Dimens.content_text_size,
    flex: 1,
};
//#endregion
