//#region Import Modules
import React, { FunctionComponent } from "react";
import { TextStyle, ViewStyle } from "react-native";
import { Button as PaperButton } from "react-native-paper";

import { Colors, Dimens, Fonts } from "../constants";
//#endregion

//#region Types
export type FlatButtonProps = {
    children: string;
    labelStyle?: TextStyle;
    contentStyle?: ViewStyle;
    onPress?: () => void;
};
//#endregion

//#region Constant
const labelStyle: TextStyle = {
    color: Colors.white,
    fontFamily: Fonts.primarySemiBold,
    fontSize: Dimens.button_flat_text_size,
};
const contentStyle: ViewStyle = {
    marginBottom: Dimens.button_flat_margin_bottom,
    height: Dimens.button_flat_height,
};
//#endregionk

//#region Component
export const FlatButton: FunctionComponent<FlatButtonProps> = (
    props: FlatButtonProps
) => {
    return (
        <PaperButton
            onPress={props.onPress}
            mode={"text"}
            labelStyle={[labelStyle, props.labelStyle]}
            contentStyle={[contentStyle, props.contentStyle]}
        >
            {props.children}
        </PaperButton>
    );
};
//#endregion
