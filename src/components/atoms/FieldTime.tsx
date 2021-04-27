//#region Import Modules
import React, { FunctionComponent } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Colors } from "../../constants";
import { InlineTimePicker } from ".";

import { TimeField } from "../../sdk/AuroraTypes";
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
export const FieldTime: FunctionComponent<FieldTimeProps> = (
    props: FieldTimeProps
) => {
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
