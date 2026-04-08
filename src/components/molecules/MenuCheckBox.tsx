//#region Import Modules
import React, { type FunctionComponent } from "react";
import type { TextStyle, ViewStyle } from "react-native";
import { Colors } from "../../constants";
import { LabeledCheckBox } from ".";
import type { LabeledCheckBoxProps } from "./LabeledCheckBox";
//#endregion

//#region Types
export type MenuCheckBoxProps = Omit<LabeledCheckBoxProps, "labelPlace">;
//#endregion
export const MenuCheckBox: FunctionComponent<MenuCheckBoxProps> = (props: MenuCheckBoxProps) => {
    return (
        <LabeledCheckBox
            {...props}
            labelPlace={"right"}
            container={[container, props.container]}
            labelStyle={[labelStyle, props.labelStyle]}
            descriptionStyle={[descriptionStyle, props.descriptionStyle]}
        ></LabeledCheckBox>
    );
};

const container: ViewStyle = {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 4,
};

const labelStyle: TextStyle = { color: Colors.white, marginBottom: 0 };
const descriptionStyle: TextStyle = {
    color: Colors.gray,
    fontSize: 10,
};
