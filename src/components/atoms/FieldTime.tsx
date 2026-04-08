//#region Import Modules
import React, { type FunctionComponent } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Colors } from "../../constants";
import type { TimeField } from "../../sdk/AuroraTypes";
import { InlineTimePicker } from "./InlineTimePicker";
//#endregion

//#region Types
export type FieldTimeProps = {
    value: boolean | string;
    field: TimeField;
    disabled: boolean;
    onValueChange: () => void;
    style?: StyleProp<ViewStyle>;
};
//#endregion

//#region Component
export const FieldTime: FunctionComponent<FieldTimeProps> = (_props: FieldTimeProps) => {
    return (
        <InlineTimePicker
            containerStyle={{
                backgroundColor: Colors.cardBackgroundColor,
                margin: 0,
            }}
            style={{
                backgroundColor: Colors.third_accent_color,
            }}
        ></InlineTimePicker>
    );
};
//#endregion
