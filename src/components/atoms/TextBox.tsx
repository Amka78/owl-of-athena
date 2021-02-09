//#region Import Modules
import { useTheme } from "react-native-paper";
import React, { FunctionComponent } from "react";
import { TextInputProps } from "react-native";
import { TextInput } from "react-native-paper";

import { Colors, Dimens, Fonts, Layout } from "../../constants";
//#endregion

//#region Types
export type TextBoxProps = Omit<TextInputProps, "selectionColor"> & {
    error?: boolean;
    label?: string;
    selectionColor?: string;
    underlineColor?: string;
};
//#endregion

//#region Component
export const TextBox: FunctionComponent<TextBoxProps> = (
    props: TextBoxProps
) => {
    const theme = useTheme();
    return (
        <TextInput
            {...props}
            mode={"flat"}
            selectionColor={
                props.selectionColor ? props.selectionColor : Colors.white
            }
            style={textInputStyle}
            underlineColor={
                props.underlineColor ? props.underlineColor : Colors.white
            }
            theme={theme}
        ></TextInput>
    );
};
//#endregion

//#region Styles
const textInputStyle = {
    marginBottom: Dimens.button_margin_bottom,
    fontFamily: Fonts.primaryRegular,
    fontSize: Dimens.input_text_size,
    width: Layout.window.fixedWidth - Dimens.content_margin_horizontal * 2,
};
//#endregion
