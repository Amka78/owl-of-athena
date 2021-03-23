//#region Import Modules
import React, { FunctionComponent } from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { RadioButton, useTheme } from "react-native-paper";
//#endregion

//#region Types
export type LabeledRadioButtonProps = {
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
    value: string;
    label: React.ReactNode;
    radioButtonColor?: string;
    radioButtonUncheckedColor?: string;
    onLabelPress?: () => void;
};
//#endregion

//#region Component
export const LabeledRadioButton: FunctionComponent<LabeledRadioButtonProps> = (
    props: LabeledRadioButtonProps
) => {
    const theme = useTheme();
    return (
        <View style={[styles.radioButtonContainer, props.containerStyle]}>
            <RadioButton
                value={props.value}
                color={
                    props.radioButtonColor
                        ? props.radioButtonColor
                        : theme.colors.accent
                }
                uncheckedColor={
                    props.radioButtonUncheckedColor
                        ? props.radioButtonUncheckedColor
                        : theme.colors.accent
                }
            />
            <Text
                style={[{ color: theme.colors.text }, props.textStyle]}
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
});
//#endregion
