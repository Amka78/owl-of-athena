//#region Import Modules
import React, { type FunctionComponent } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Colors } from "../../constants";
import { LedColors } from "../../sdk/AuroraConstants";
//#endregion

//#region Types
export type LedColorPickerProps = {
    value?: string;
    disabled?: boolean;
    onValueChange: (value: string) => void;
};
//#endregion

//#region Component
export const LedColorPicker: FunctionComponent<LedColorPickerProps> = (
    props: LedColorPickerProps,
) => {
    return (
        <View style={styles.container}>
            {LedColors.map((color) => {
                const selected = (props.value ?? "").toUpperCase() === color.value.toUpperCase();

                return (
                    <TouchableOpacity
                        key={color.name}
                        accessibilityLabel={color.name}
                        disabled={props.disabled}
                        style={[
                            styles.swatch,
                            { backgroundColor: color.value },
                            selected ? styles.selected : undefined,
                        ]}
                        onPress={(): void => props.onValueChange(color.value)}
                    ></TouchableOpacity>
                );
            })}
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 8,
    },
    swatch: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Colors.gray,
    },
    selected: {
        borderWidth: 3,
        borderColor: Colors.white,
    },
});
//#endregion
