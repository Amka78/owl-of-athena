//#region Import Modules
import Slider from "@react-native-community/slider";
import React, { type FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors, Dimens, Fonts } from "../../constants";
//#endregion

//#region Types
export type LabeledSliderProps = {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    disabled?: boolean;
    formatValue?: (value: number) => string;
    onValueChange: (value: number) => void;
};
//#endregion

//#region Component
export const LabeledSlider: FunctionComponent<LabeledSliderProps> = (props: LabeledSliderProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <Text style={styles.label}>{props.label}</Text>
                <Text style={styles.value}>
                    {props.formatValue ? props.formatValue(props.value) : String(props.value)}
                </Text>
            </View>
            <Slider
                value={props.value}
                minimumValue={props.min}
                maximumValue={props.max}
                step={props.step}
                disabled={props.disabled}
                onValueChange={props.onValueChange}
            ></Slider>
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: {
        marginBottom: Dimens.option_margin_bottom,
    },
    labelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        color: Colors.cyan,
        fontFamily: Fonts.primaryRegular,
        fontSize: Dimens.option_text_size,
        flexShrink: 1,
    },
    value: {
        color: Colors.white,
        fontFamily: Fonts.primaryRegular,
        fontSize: Dimens.option_text_size,
        marginLeft: 8,
    },
});
//#endregion
