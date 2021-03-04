//#region Import Modules
import React, { FunctionComponent } from "react";
import { IconProps } from "react-native-vector-icons/Icon";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "../../constants";
//#endregion

//#region Types
export type TemplateIconProps = IconProps;
//#endregion

//#region Component
export const TemplateIcon: FunctionComponent<TemplateIconProps> = (
    props: TemplateIconProps
) => {
    return (
        <MaterialCommunityIcons
            {...props}
            color={props.color ? props.color : Colors.white}
            size={props.size ? props.size : 40}
        ></MaterialCommunityIcons>
    );
};
//#endregion
