import React, { FunctionComponent } from "react";
import { TextInputProps } from "react-native";
import { TextInput } from "react-native-paper";
import {
    Dimens,
    Fonts,
    Message,
    Layout,
    Colors,
    MessageLocalizationParam
} from "../constants";

export type TextBoxProps = TextInputProps & {
    label?: MessageLocalizationParam;
    localizedPlaceholder?: MessageLocalizationParam;
};

const textInputStyle = {
    backgroundColor: "transparent",
    marginBottom: Dimens.button_margin_bottom,
    fontFamily: Fonts.primaryRegular,
    fontSize: Dimens.input_text_size,
    width: Layout.window.fixedWidth - Dimens.content_margin_horizontal * 2
};
export const TextBox: FunctionComponent<TextBoxProps> = (
    props: TextBoxProps
) => {
    return (
        <TextInput
            {...props}
            mode={"flat"}
            style={textInputStyle}
            underlineColor={Colors.white}
            placeholder={
                props.localizedPlaceholder
                    ? Message.get(
                          props.localizedPlaceholder!.key,
                          props.localizedPlaceholder!.restParam
                      )
                    : props.placeholder
            }
            label={
                props.label
                    ? Message.get(props.label.key, props.label.restParam)
                    : undefined
            }
            theme={{
                colors: {
                    text: Colors.cyan,
                    placeholder: Colors.white,
                    primary: Colors.cyan
                }
            }}
        ></TextInput>
    );
};
