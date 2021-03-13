//#region Import Modules
import React, { FunctionComponent } from "react";
import { TextStyle, ViewStyle } from "react-native";

import { LabeledCheckBox } from ".";
import { Colors } from "../../constants";
import { LabeledCheckBoxProps } from "./LabeledCheckBox";
//#endregion

//#region Types
export type MenuCheckBoxProps = Omit<LabeledCheckBoxProps, "labelPlace">;
//#endregion
export const MenuCheckBox: FunctionComponent<MenuCheckBoxProps> = (
    props: MenuCheckBoxProps
) => {
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
