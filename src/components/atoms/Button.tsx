//#region Import Modules
import React, { FunctionComponent } from "react";
import { TextStyle, ViewStyle } from "react-native";
import { Button as PaperButton, useTheme } from "react-native-paper";

import { Dimens, Fonts, Layout, ThemeType } from "../../constants";
//#endregion

//#region Types
export type ButtonProps = {
    children: string;
    disabled?: boolean;
    onPress?: () => void;
    labelStyle?: TextStyle;
    style?: ViewStyle;
};
//#endregion

//#region Component
export const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
    const theme: ThemeType = useTheme();

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <PaperButton
            {...props}
            disabled={props.disabled !== undefined ? props.disabled! : false}
            mode={"contained"}
            labelStyle={[labelStyle, props.labelStyle]}
            style={[containerStyle, props.style]}
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
    marginBottom: Dimens.button_margin_bottom,
    height: Dimens.button_height,
    width: Layout.window.fixedWidth - Dimens.content_margin_horizontal * 2,
};
//#endregion
