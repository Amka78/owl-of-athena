//#region Import Modules
import type React from "react";
import type { FunctionComponent } from "react";
import { StyleSheet, Text, type TextStyle, View, type ViewStyle } from "react-native";
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
    props: LabeledRadioButtonProps,
) => {
    const theme = useTheme();
    return (
        <View style={[styles.radioButtonContainer, props.containerStyle]}>
            <RadioButton
                value={props.value}
                color={props.radioButtonColor ? props.radioButtonColor : theme.colors.secondary}
                uncheckedColor={
                    props.radioButtonUncheckedColor
                        ? props.radioButtonUncheckedColor
                        : theme.colors.secondary
                }
            />
            <Text
                style={[{ color: theme.colors.onSurface }, props.textStyle]}
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
        // `flex: 1` は高さ不定の列（Web の Dialog 等）で行を高さ 0 に潰して重ねてしまうため使わない。
        minHeight: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
});
//#endregion
