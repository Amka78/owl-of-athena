import React, { FunctionComponent } from "react";
import { Button as PaperButton } from "react-native-paper";
import { Message, Colors, Dimens, Fonts, Layout } from "../constants";
import { MessageLocalizationParam } from "../constants/Message";
import { TextStyle, ViewStyle } from "react-native";

export type ButtonProps = {
    children: MessageLocalizationParam;
    disabled?: boolean;
    onPress?: () => void;
};

const labelStyle: TextStyle = {
    color: Colors.navy,
    fontFamily: Fonts.primarySemiBold,
    fontSize: Dimens.button_text_size
};
const containerStyle: ViewStyle = {
    backgroundColor: Colors.teal,
    borderRadius: Dimens.button_radius,
    marginBottom: Dimens.button_margin_bottom,
    height: Dimens.button_height,
    width: Layout.window.fixedWidth - Dimens.content_margin_horizontal * 2
};
export const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
    return (
        <PaperButton
            disabled={props.disabled !== undefined ? props.disabled! : false}
            onPress={props.onPress}
            mode={"contained"}
            labelStyle={labelStyle}
            style={containerStyle}
        >
            {Message.get(props.children.key, props.children.restParam)}
        </PaperButton>
    );
};
