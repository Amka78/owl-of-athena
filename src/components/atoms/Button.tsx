//#region Import Modules
import React, { FunctionComponent } from "react";
import { TextStyle, ViewStyle } from "react-native";
import { Button as PaperButton, useTheme } from "react-native-paper";

import { Dimens, Fonts } from "../../constants";
import { ThemeType } from "../../constants/Theme";
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
//#endregion
