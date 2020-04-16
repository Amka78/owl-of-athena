import React, { FunctionComponent } from "react";
import { StyleSheet, Text, View, TextStyle, ViewStyle } from "react-native";
import { Checkbox } from "react-native-paper";
import { Dimens, Fonts, Message, Layout, Colors } from "../constants";
import { MessageLocalizationParam } from "../constants/Message";
export type CheckBoxStatus = "checked" | "unchecked" | "indeterminate";

export type LabelPlace = "left" | "right";
export type LabeledCheckBoxProps = {
    container?: ViewStyle;
    labelPlace: LabelPlace;
    label?: MessageLocalizationParam;
    labelStyle?: TextStyle;
    description?: MessageLocalizationParam;
    descriptionStyle?: TextStyle;
    status: CheckBoxStatus;
    onPress?: () => void;
};

export const LabeledCheckBox: FunctionComponent<LabeledCheckBoxProps> = (
    props: LabeledCheckBoxProps
) => {
    const labelComponent = (
        <Text style={[style.text, props.labelStyle]}>
            {Message.get(props.label!.key, props.label!.restParam)}
        </Text>
    );

    const descriptionComponent = (
        <Text style={[style.text, props.descriptionStyle]}>
            {Message.get(props.description!.key, props.description!.restParam)}
        </Text>
    );

    const labelContainerComponent = (
        <View
            style={{
                alignItems: "flex-start",
                justifyContent: "center",
                flex: 1,
            }}
        >
            {labelComponent}
            {props.description ? descriptionComponent : undefined}
        </View>
    );
    return (
        <View style={[style.container, props.container]}>
            {props.labelPlace === "left" ? labelContainerComponent : undefined}
            <View style={{ marginBottom: Dimens.option_margin_bottom }}>
                <Checkbox
                    {...props}
                    color={Colors.white}
                    uncheckedColor={Colors.white}
                    onPress={props.onPress}
                ></Checkbox>
            </View>
            {props.labelPlace === "right" ? labelContainerComponent : undefined}
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: Layout.window.fixedWidth - Dimens.content_margin_horizontal * 2,
    },
    text: {
        color: Colors.cyan,
        flex: 1,
        marginBottom: Dimens.option_margin_bottom,
        fontFamily: Fonts.primaryRegular,
        fontSize: Dimens.option_text_size,
    },
});
