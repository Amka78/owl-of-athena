//#region Import Modules
import React, { FunctionComponent } from "react";
import { TextStyle, ViewStyle } from "react-native";
import { Button as PaperButton, useTheme } from "react-native-paper";

import { Dimens, Fonts } from "../../constants";
//#endregion

//#region Types
export type FlatButtonProps = {
    children: string;
    labelStyle?: TextStyle;
    contentStyle?: ViewStyle;
    onPress?: () => void;
};
//#endregion

//#region Component
export const FlatButton: FunctionComponent<FlatButtonProps> = (
    props: FlatButtonProps
) => {
    const theme = useTheme();
    return (
        <PaperButton
            onPress={props.onPress}
            mode={"text"}
            labelStyle={[
                labelStyle,
                { color: theme?.colors.text },
                props.labelStyle,
            ]}
            contentStyle={[contentStyle, props.contentStyle]}
        >
            {props.children}
        </PaperButton>
    );
};
//#endregion

//#region Styles
const labelStyle: TextStyle = {
    fontFamily: Fonts.primarySemiBold,
    fontSize: Dimens.button_flat_text_size,
};
const contentStyle: ViewStyle = {
    marginTop: Dimens.button_margin,
    marginBottom: Dimens.button_flat_margin,
    height: Dimens.button_flat_height,
};
//#endregion
