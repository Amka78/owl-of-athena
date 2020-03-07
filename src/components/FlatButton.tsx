import React, { FunctionComponent } from "react";
import { Button as PaperButton } from "react-native-paper";
import {
    MessageLocalizationParam,
    Message,
    Colors,
    Dimens,
    Fonts
} from "../constants";
import { TextStyle, ViewStyle } from "react-native";

type FlatButtonProps = {
    children: MessageLocalizationParam;
    multiLingual?: boolean;
    labelStyle?: TextStyle;
    onPress?: () => void;
};

const labelStyle: TextStyle = {
    color: Colors.white,
    fontFamily: Fonts.primarySemiBold,
    fontSize: Dimens.button_flat_text_size
};
const contentStyle: ViewStyle = {
    marginBottom: Dimens.button_flat_margin_bottom,
    height: Dimens.button_flat_height
};
export const FlatButton: FunctionComponent<FlatButtonProps> = (
    props: FlatButtonProps
) => {
    return (
        <PaperButton
            onPress={props.onPress}
            mode={"text"}
            labelStyle={[labelStyle, props.labelStyle]}
            contentStyle={contentStyle}
        >
            {Message.get(props.children, props.multiLingual)}
        </PaperButton>
    );
};
