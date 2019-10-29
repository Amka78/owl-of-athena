import React, { FunctionComponent } from "react";
import { TextInputProps } from "react-native";
import { TextInput } from "react-native-paper";
import { Dimens, Fonts, Message, Layout, Colors } from "../constants";

type MultiLingualTextBoxProps = TextInputProps & { label?: string };

const textInputStyle = {
    backgroundColor: "transparent",
    marginBottom: Dimens.button_margin_bottom,
    fontFamily: Fonts.primaryRegular,
    fontSize: Dimens.input_text_size,
    width: Layout.window.width - Dimens.content_margin_horizontal * 2
};
export const MultiLingualTextBox: FunctionComponent<
    MultiLingualTextBoxProps
> = (props: MultiLingualTextBoxProps) => {
    return (
        <TextInput
            {...props}
            mode={"flat"}
            style={textInputStyle}
            underlineColor={Colors.white}
            placeholder={
                props.placeholder ? Message.get(props.placeholder) : undefined
            }
            label={props.label ? Message.get(props.label) : undefined}
            theme={{
                colors: {
                    text: Colors.white,
                    placeholder: Colors.white,
                    primary: Colors.cyan
                }
            }}
        ></TextInput>
    );
};
