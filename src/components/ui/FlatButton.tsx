//#region Import Modules
import type React from "react";
import type { FunctionComponent } from "react";
import type { TextStyle, ViewStyle } from "react-native";
import { Button as PaperButton, useTheme } from "react-native-paper";

import { Dimens, Fonts } from "../../constants";
//#endregion

//#region Types
export type FlatButtonProps = {
    children: React.ReactNode;
    labelStyle?: TextStyle;
    contentStyle?: ViewStyle;
    onPress?: () => void;
    disabled?: boolean;
};
//#endregion

//#region Component
export const FlatButton: FunctionComponent<FlatButtonProps> = (props: FlatButtonProps) => {
    const theme = useTheme();
    return (
        <PaperButton
            onPress={props.onPress}
            disabled={props.disabled}
            mode={"text"}
            labelStyle={[labelStyle, { color: theme?.colors.onSurface }, props.labelStyle]}
            contentStyle={[contentStyle, props.contentStyle]}
        >
            {props.children}
        </PaperButton>
    );
};
//#endregion

//#region Styles
// paper 既定の marginVertical(9px) を残すとラベル（lineHeight 20px + 上下 18px）が
// コンテンツ高（28px）からはみ出し、クリップされるため 0 にする。
const labelStyle: TextStyle = {
    fontFamily: Fonts.primarySemiBold,
    fontSize: Dimens.button_flat_text_size,
    marginVertical: 0,
};
const contentStyle: ViewStyle = {
    marginTop: Dimens.button_margin,
    marginBottom: Dimens.button_flat_margin,
    height: Dimens.button_flat_height,
};
//#endregion
