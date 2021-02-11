//#region Import Modules
import React, { FunctionComponent } from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Checkbox, useTheme } from "react-native-paper";

import { Dimens, Fonts, Layout } from "../../constants";
//#endregion

//#region Types
export type CheckBoxStatus = "checked" | "unchecked" | "indeterminate";

export type LabelPlace = "left" | "right";
export type LabeledCheckBoxProps = {
    container?: ViewStyle;
    labelPlace?: LabelPlace;
    label?: string;
    labelStyle?: TextStyle;
    onLabelPress?: () => void;
    description?: string;
    descriptionStyle?: TextStyle;
    status: CheckBoxStatus;
    checkBoxColor?: string;
    checkBoxUncheckedColor?: string;
    onPress?: () => void;
};
//#endregion

//#region Component
export const LabeledCheckBox: FunctionComponent<LabeledCheckBoxProps> = (
    props: LabeledCheckBoxProps
) => {
    const theme = useTheme();
    const labelComponent = (
        <Text
            onPress={props.onLabelPress}
            style={[
                styles.text,
                { color: theme.colors?.accent },
                props.labelStyle,
            ]}
        >
            {props.label}
        </Text>
    );

    const descriptionComponent = props.description ? (
        <Text
            style={[
                styles.text,
                { color: theme.colors?.accent },
                props.descriptionStyle,
            ]}
        >
            {props.description}
        </Text>
    ) : undefined;

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
        <View style={[styles.container, props.container]}>
            {props.labelPlace === "left" ? labelContainerComponent : undefined}

            <View
                style={{
                    alignItems: "flex-end",
                    justifyContent: "center",
                    flex: 1,
                }}
            >
                <Checkbox
                    {...props}
                    color={
                        props.checkBoxColor
                            ? props.checkBoxColor
                            : theme.colors?.text
                    }
                    uncheckedColor={
                        props.checkBoxUncheckedColor
                            ? props.checkBoxUncheckedColor
                            : theme.colors?.text
                    }
                    onPress={props.onPress}
                ></Checkbox>
            </View>
            {props.labelPlace === "right" ? labelContainerComponent : undefined}
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: {
        //flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: Layout.window.fixedWidth - Dimens.content_margin_horizontal * 2,
        marginBottom: Dimens.option_margin_bottom,
    },
    text: {
        fontFamily: Fonts.primaryRegular,
        fontSize: Dimens.option_text_size,
    },
});
//#endregion
