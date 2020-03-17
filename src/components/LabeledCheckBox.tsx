import React, { FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Checkbox } from "react-native-paper";
import { Dimens, Fonts, Message, Layout, Colors } from "../constants";
import { MessageLocalizationParam } from "../constants/Message";
export type CheckBoxStatus = "checked" | "unchecked" | "indeterminate";
export type LabeledCheckBoxProps = {
    label?: MessageLocalizationParam;
    status: CheckBoxStatus;
    onPress?: () => void;
};

export const LabeledCheckBox: FunctionComponent<LabeledCheckBoxProps> = (
    props: LabeledCheckBoxProps
) => {
    return (
        <View style={style.container}>
            <Text style={style.label}>
                {Message.get(props.label!.key, props.label!.restParam)}
            </Text>
            <View style={{ marginBottom: Dimens.option_margin_bottom }}>
                <Checkbox
                    {...props}
                    color={Colors.white}
                    uncheckedColor={Colors.white}
                    onPress={props.onPress}
                ></Checkbox>
            </View>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: Layout.window.fixedWidth - Dimens.content_margin_horizontal * 2
    },
    label: {
        color: Colors.cyan,
        flex: 1,
        marginBottom: Dimens.option_margin_bottom,
        fontFamily: Fonts.primaryRegular,
        fontSize: Dimens.option_text_size
    }
});
