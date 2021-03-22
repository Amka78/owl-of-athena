//#region Import Modules
import React, { FunctionComponent } from "react";
import { Text, TextStyle } from "react-native";
import { Dimens, Fonts } from "../../constants";
import { ThemeType } from "../../constants/Theme";
import { useTheme } from "react-native-paper";
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
    const theme: ThemeType | undefined = useTheme();

    return (
        <Text
            style={[textStyle, { color: theme?.colors?.accent }, props.style]}
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
