//#region Import Modules
import React, { FunctionComponent } from "react";
import { TextInputProps } from "react-native";
import { TextInput, useTheme } from "react-native-paper";

import { Colors, Dimens, Fonts, Layout } from "../../constants";
import { useWindowDimensions } from "../../hooks";
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
    const dimens = useWindowDimensions();
    let width = dimens.width - Dimens.content_margin_horizontal * 2;

    if (width > Dimens.input_text_max_width) {
        width = Dimens.input_text_max_width;
    }
    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        <TextInput
            {...props}
            mode={"flat"}
            selectionColor={
                props.selectionColor ? props.selectionColor : Colors.white
            }
            style={[textInputStyle, { width }, props.style]}
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
