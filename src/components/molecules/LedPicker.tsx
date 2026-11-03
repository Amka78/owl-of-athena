//#region Import Modules
import React, { type FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import { LabeledSlider } from "./LabeledSlider";
import { LedColorPicker } from "./LedColorPicker";
import { LedEyePicker } from "./LedEyePicker";
//#endregion

//#region Types
export type LedPickerValue = {
    eyes?: string;
    color?: string;
    brightness?: number;
};

export type LedPickerProps = {
    label?: string;
    value?: LedPickerValue;
    disabled?: boolean;
    onValueChange: (value: LedPickerValue) => void;
};
//#endregion

//#region Component
export const LedPicker: FunctionComponent<LedPickerProps> = (props: LedPickerProps) => {
    const value = props.value ?? {};
    const update = (change: LedPickerValue): void => {
        props.onValueChange({ ...value, ...change });
    };

    return (
        <View style={styles.container}>
            {props.label ? <Text style={styles.title}>{props.label}</Text> : undefined}
            <LedEyePicker
                value={value.eyes}
                disabled={props.disabled}
                onValueChange={(eyes): void => update({ eyes })}
            ></LedEyePicker>
            <Text style={styles.label}>{Message.get(MessageKeys.led_color)}</Text>
            <LedColorPicker
                value={value.color}
                disabled={props.disabled}
                onValueChange={(color): void => update({ color })}
            ></LedColorPicker>
            <LabeledSlider
                label={Message.get(MessageKeys.led_brightness)}
                value={value.brightness ?? 100}
                min={0}
                max={100}
                step={1}
                disabled={props.disabled}
                formatValue={(brightness): string => `${brightness}%`}
                onValueChange={(brightness): void => update({ brightness })}
            ></LabeledSlider>
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    title: {
        color: Colors.white,
        fontFamily: Fonts.primarySemiBold,
        fontSize: Dimens.option_text_size + 1,
        marginBottom: 8,
    },
    label: {
        color: Colors.cyan,
        fontFamily: Fonts.primaryRegular,
        fontSize: Dimens.option_text_size,
        marginBottom: 4,
    },
});
//#endregion
