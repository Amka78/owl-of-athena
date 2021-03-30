//#region Import Modules
import React, { FunctionComponent } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Switch } from "react-native-gesture-handler";
import { ToggleField } from "../../../../sdk/AuroraTypes";
//#endregion

//#region Types
export type FieldToggleProps = {
    value: boolean | string;
    field: ToggleField;
    disabled: boolean;
    onValueChange: () => void;
    style?: StyleProp<ViewStyle>;
};
//#endregion

//#region Component
export const FieldToggle: FunctionComponent<FieldToggleProps> = (
    props: FieldToggleProps
) => {
    return (
        <Switch
            {...props}
            value={props.value === props.field.valueEnabled}
        ></Switch>
    );
};
//#endregion
