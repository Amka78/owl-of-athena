//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { HelperText } from "react-native-paper";

import { TextBox, TextBoxProps } from "../atoms";
//#endregion

//#region Types
export type ValidatableTextBoxProps = TextBoxProps & { helperText?: string };
//#endregion

//#region Component
export const ValidatableTextBox: FunctionComponent<ValidatableTextBoxProps> = (
    props: ValidatableTextBoxProps
) => {
    return (
        <View style={{ flex: 1 }}>
            <TextBox {...props} error={props.helperText !== ""}></TextBox>
            <HelperText type={"error"} visible={props.helperText == ""}>
                {props.helperText}
            </HelperText>
        </View>
    );
};
//#endregion
