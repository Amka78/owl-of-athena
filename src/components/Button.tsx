//#region Import Modules
import React, { FunctionComponent } from "react";
import { Button as PaperButton } from "react-native-paper";
import { Colors, Dimens, Fonts, Layout } from "../constants";
import { TextStyle, ViewStyle } from "react-native";
//#endregion

//#region Types
export type ButtonProps = {
    children: string;
    disabled?: boolean;
    onPress?: () => void;
};
//#endregion

//#region Component
export const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
    return (
        <PaperButton
            disabled={props.disabled !== undefined ? props.disabled! : false}
            onPress={props.onPress}
            mode={"contained"}
            labelStyle={labelStyle}
            style={containerStyle}
        >
            {props.children}
        </PaperButton>
    );
};
//#endregion

//#region Styles
const labelStyle: TextStyle = {
    color: Colors.navy,
    fontFamily: Fonts.primarySemiBold,
    fontSize: Dimens.button_text_size,
};
const containerStyle: ViewStyle = {
    backgroundColor: Colors.teal,
    borderRadius: Dimens.button_radius,
    marginBottom: Dimens.button_margin_bottom,
    height: Dimens.button_height,
    width: Layout.window.fixedWidth - Dimens.content_margin_horizontal * 2,
};
//#endregion
