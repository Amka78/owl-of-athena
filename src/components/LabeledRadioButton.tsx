//#region Import Modules
import React, { FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";

import { Colors } from "../constants";
//#endregion

//#region Types
export type LabeledRadioButtonProps = {
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
        <View style={styles.radioButtonContainer}>
            <RadioButton
                value={props.value}
                color={Colors.cyan}
                uncheckedColor={Colors.cyan}
            />
            <Text style={{ color: Colors.white }} onPress={props.onLabelPress}>
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});
//#endregion
