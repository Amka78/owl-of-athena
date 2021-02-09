//#region Import Modules
import React, { FunctionComponent } from "react";
import { Checkbox as PaperCheckBox, useTheme } from "react-native-paper";
//#endregion

//#region Types
export type CheckBoxProps = {
    color?: string;
    disabled?: boolean;
    status: "checked" | "unchecked" | "indeterminate";
    uncheckedColor?: string;
    onPress?: () => void;
};
//#endregion

//#region Component
export const CheckBox: FunctionComponent<CheckBoxProps> = (
    props: CheckBoxProps
) => {
    const theme = useTheme();
    return (
        <PaperCheckBox
            {...props}
            color={props.color ? props.color : undefined}
            disabled={props.disabled}
            status={props.status}
            onPress={props.onPress}
            uncheckedColor={
                props.uncheckedColor ? props.uncheckedColor : undefined
            }
            theme={theme}
        ></PaperCheckBox>
    );
};
//#endregion
