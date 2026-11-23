//#region Import Modules
import React, { type FunctionComponent } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Switch } from "react-native-paper";

import type { ToggleField } from "../../sdk/AuroraTypes";
//#endregion

//#region Types
export type FieldToggleProps = {
    value?: boolean | string;
    field: ToggleField;
    disabled: boolean;
    onValueChange: (value: boolean | string) => void;
    style?: StyleProp<ViewStyle>;
};
//#endregion

//#region Component
export const FieldToggle: FunctionComponent<FieldToggleProps> = (props: FieldToggleProps) => {
    const hasMappedValues = props.field.valueEnabled !== undefined;
    const checked =
        typeof props.value === "boolean"
            ? props.value
            : hasMappedValues
              ? props.value === props.field.valueEnabled
              : Boolean(props.value);

    const onValueChange = (value: boolean): void => {
        if (hasMappedValues) {
            props.onValueChange(
                value ? props.field.valueEnabled! : (props.field.valueDisabled ?? "0x00"),
            );
            return;
        }

        props.onValueChange(value);
    };

    return (
        <Switch
            value={checked}
            disabled={props.disabled}
            style={props.style}
            onValueChange={onValueChange}
        ></Switch>
    );
};
//#endregion
