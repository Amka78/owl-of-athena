import React, { FunctionComponent } from "react";
import { Text, TextStyle } from "react-native";
import {
    MessageLocalizationParam,
    Message,
    Colors,
    Dimens,
    Fonts
} from "../constants";

type ContentTextProps = {
    children: MessageLocalizationParam;
    style?: TextStyle;
};
export const ContentText: FunctionComponent<ContentTextProps> = (
    props: ContentTextProps
) => {
    return (
        <Text style={[textStyle, props.style]}>
            {Message.get(props.children.key, props.children.restParam)}
        </Text>
    );
};
const textStyle: TextStyle = {
    color: Colors.cyan,
    fontFamily: Fonts.primaryRegular,
    fontSize: Dimens.content_text_size,
    flex: 1
};
