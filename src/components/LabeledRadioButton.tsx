//#region Import Modules
import React, { FunctionComponent } from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { RadioButton } from "react-native-paper";

import { Colors } from "../constants";
//#endregion

//#region Types
export type LabeledRadioButtonProps = {
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
    value: string;
    label: string;
    onLabelPress?: () => void;
};
//#endregion

//#region Component
export const LabeledRadioButton: FunctionComponent<LabeledRadioButtonProps> = (
    props: LabeledRadioButtonProps
) => {
    return (
        <View style={[styles.radioButtonContainer, props.containerStyle]}>
            <RadioButton
                value={props.value}
                color={Colors.cyan}
                uncheckedColor={Colors.cyan}
            />
            <Text
                style={[styles.text, props.textStyle]}
                onPress={props.onLabelPress}
            >
                {props.label}
            </Text>
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    radioButtonContainer: {
        flex: 1,
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    text: {
        color: Colors.white,
    },
});
//#endregion
