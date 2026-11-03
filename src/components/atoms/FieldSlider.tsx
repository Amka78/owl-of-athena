//#region Import Modules
import Slider from "@react-native-community/slider";
import React, { type FunctionComponent } from "react";
import { type StyleProp, Text, View, type ViewStyle } from "react-native";

import { Colors } from "../../constants";
import type { SliderField } from "../../sdk/AuroraTypes";
//#endregion

//#region Types
export type FieldSliderProps = {
    value?: number;
    field: SliderField;
    disabled: boolean;
    onValueChange: (value: number) => void;
    style?: StyleProp<ViewStyle>;
    showValue?: boolean;
};
//#endregion

//#region Component
export const FieldSlider: FunctionComponent<FieldSliderProps> = (props: FieldSliderProps) => {
    const value = props.value ?? props.field.min;

    return (
        <View style={props.style}>
            <Slider
                value={value}
                minimumValue={props.field.min}
                maximumValue={props.field.max}
                step={props.field.step}
                disabled={props.disabled}
                onValueChange={props.onValueChange}
            ></Slider>
            {props.showValue !== false && (
                <Text style={valueLabelStyle}>{formatValue(value, props.field)}</Text>
            )}
        </View>
    );
};

const formatValue = (value: number, field: SliderField): string => {
    if (value === field.min && field.labelMin) return field.labelMin;

    switch (field.format) {
        case "hours":
            return `${value} h`;
        case "minutes":
            return `${value} min`;
        default:
            return String(value);
    }
};
//#endregion

//#region Styles
const valueLabelStyle = {
    color: Colors.white,
    fontSize: 12,
    marginTop: -4,
    textAlign: "center" as const,
};
//#endregion
