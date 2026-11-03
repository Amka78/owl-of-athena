//#region Import Modules
import { Picker } from "@react-native-picker/picker";
import React, { type FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
//#endregion

//#region Types
export type LedEyePickerProps = {
    value?: string;
    label?: string;
    disabled?: boolean;
    onValueChange: (value: string) => void;
};
//#endregion

//#region Component
export const LedEyePicker: FunctionComponent<LedEyePickerProps> = (props: LedEyePickerProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{props.label ?? Message.get(MessageKeys.led_eyes)}</Text>
            <Picker
                selectedValue={props.value ?? "both"}
                enabled={!props.disabled}
                style={styles.picker}
                onValueChange={(value: string | number): void => props.onValueChange(String(value))}
            >
                <Picker.Item
                    value={"none"}
                    label={Message.get(MessageKeys.led_eyes_none)}
                ></Picker.Item>
                <Picker.Item
                    value={"both"}
                    label={Message.get(MessageKeys.led_eyes_both)}
                ></Picker.Item>
                <Picker.Item
                    value={"left"}
                    label={Message.get(MessageKeys.led_eyes_left)}
                ></Picker.Item>
                <Picker.Item
                    value={"right"}
                    label={Message.get(MessageKeys.led_eyes_right)}
                ></Picker.Item>
            </Picker>
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    label: {
        color: Colors.cyan,
        fontFamily: Fonts.primaryRegular,
        fontSize: Dimens.option_text_size,
        marginBottom: 4,
    },
    picker: {
        backgroundColor: Colors.purple,
        color: Colors.white,
    },
});
//#endregion
