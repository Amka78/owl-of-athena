//#region Import Modules
import React, { FunctionComponent } from "react";
import { TextInputProps } from "react-native";
import { TextInput } from "react-native-paper";

import { Colors, Dimens, Fonts, Layout } from "../constants";
//#endregion

//#region Types
export type TextBoxProps = TextInputProps & {
    error?: boolean;
    label?: string;
};
//#endregion

//#region Component
export const TextBox: FunctionComponent<TextBoxProps> = (
    props: TextBoxProps
) => {
    return (
        <TextInput
            {...props}
            mode={"flat"}
            selectionColor={Colors.white}
            style={textInputStyle}
            underlineColor={Colors.white}
            theme={{
                colors: {
                    text: Colors.cyan,
                    placeholder: Colors.white,
                    primary: Colors.cyan,
                },
            }}
        ></TextInput>
    );
};
//#endregion

//#region Styles
const textInputStyle = {
    backgroundColor: "transparent",
    marginBottom: Dimens.button_margin_bottom,
    fontFamily: Fonts.primaryRegular,
    fontSize: Dimens.input_text_size,
    width: Layout.window.fixedWidth - Dimens.content_margin_horizontal * 2,
};
//#endregion
