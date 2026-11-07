//#region Import Modules
import React, { type FunctionComponent } from "react";
import { Platform, type TextStyle, type ViewStyle } from "react-native";
import { Button as PaperButton, useTheme } from "react-native-paper";

import { Dimens, Fonts } from "../../constants";
import type { ThemeType } from "../../constants/Theme";
//#endregion

//#region Types
export type ButtonProps = {
    children: string;
    disabled?: boolean;
    onPress?: () => void;
    labelStyle?: TextStyle;
    style?: ViewStyle | any[];
    screenWidth: number;
};
//#endregion

//#region Component
export const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
    const theme: ThemeType = useTheme();

    let width = props.screenWidth - Dimens.content_margin_horizontal * 2;

    if (width > Dimens.button_max_width) {
        width = Dimens.button_max_width;
    }
    return (
        <PaperButton
            {...props}
            disabled={props.disabled !== undefined ? props.disabled : false}
            mode={"contained"}
            labelStyle={[labelStyle, props.labelStyle]}
            contentStyle={Platform.OS === "web" ? webContentStyle : undefined}
            style={[containerStyle, { width }, props.style]}
            theme={theme}
        >
            {props.children}
        </PaperButton>
    );
};
//#endregion

//#region Styles
const labelStyle: TextStyle = {
    fontFamily: Fonts.primarySemiBold,
    fontSize: Dimens.button_text_size,
};
const containerStyle: ViewStyle = {
    borderRadius: Dimens.button_radius,
    marginTop: Dimens.button_margin,
    marginBottom: Dimens.button_margin,
    height: Dimens.button_height,
};
// Web の Surface は子要素を縦に伸ばさないため、コンテンツをボタン高まで広げて中央寄せにする。
const webContentStyle: ViewStyle = { minHeight: Dimens.button_height };
//#endregion
