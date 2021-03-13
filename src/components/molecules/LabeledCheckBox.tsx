//#region Import Modules
import React, { FunctionComponent } from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Checkbox, useTheme } from "react-native-paper";

import { Dimens, Fonts } from "../../constants";
import { useWindowDimensions } from "../../hooks";
//#endregion

//#region Types
export type CheckBoxStatus = "checked" | "unchecked" | "indeterminate";

export type LabelPlace = "left" | "right";
export type LabeledCheckBoxProps = {
    container?: ViewStyle | any[];
    labelPlace?: LabelPlace;
    label?: string;
    labelStyle?: TextStyle | any[];
    onLabelPress?: () => void;
    description?: string;
    descriptionStyle?: TextStyle | any[];
    status: CheckBoxStatus;
    checkBoxStyle?: ViewStyle;
    textContainerStyle?: ViewStyle;
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
    const dimens = useWindowDimensions();

    let width = dimens.width;

    if (width > Dimens.checkbox_max_width) {
        width = Dimens.checkbox_max_width;
    }
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

    const textContainerComponent = (
        <View style={[styles.textContainer, props.textContainerStyle]}>
            {labelComponent}
            {props.description ? descriptionComponent : undefined}
        </View>
    );
    return (
        <View style={[styles.container, { width }, props.container]}>
            {props.labelPlace === "left" ? textContainerComponent : undefined}

            <View style={[styles.checkBoxStyle, props.checkBoxStyle]}>
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
            {props.labelPlace === "right" ? textContainerComponent : undefined}
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        //flex: 1,
        marginBottom: Dimens.option_margin_bottom,
    },
    text: {
        fontFamily: Fonts.primaryRegular,
        fontSize: Dimens.option_text_size,
    },
    checkBoxStyle: {
        alignItems: "flex-end",
        flex: 1,
        justifyContent: "center",
    },
    textContainer: {
        alignItems: "flex-start",
        flex: 1,
        justifyContent: "center",
    },
});
//#endregion
