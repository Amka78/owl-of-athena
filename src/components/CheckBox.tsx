import React, { FunctionComponent } from "react";
import { Checkbox as PaperCheckBox } from "react-native-paper";
import { Colors } from "../constants";

type CheckBoxProps = {
    status: "checked" | "unchecked" | "indeterminate";
    onPress?: () => void;
};

export const CheckBox: FunctionComponent<CheckBoxProps> = (
    props: CheckBoxProps
) => {
    return (
        <PaperCheckBox
            color={Colors.teal}
            status={props.status}
            onPress={props.onPress}
            uncheckedColor={Colors.teal}
        ></PaperCheckBox>
    );
};
