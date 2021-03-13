//#region Import Modules
import React, { FunctionComponent } from "react";
import { IconProps } from "react-native-vector-icons/Icon";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "../../constants";
//#endregion

//#region Types
export type TemplateIconProps = IconProps & { disabled: boolean };
//#endregion

//#region Component
export const TemplateIcon: FunctionComponent<TemplateIconProps> = (
    props: TemplateIconProps
) => {
    const color = props.disabled ? Colors.gray : Colors.white;
    return (
        <MaterialCommunityIcons
            {...props}
            color={props.color ? props.color : color}
            size={props.size ? props.size : 40}
            onPress={props.disabled ? undefined : props.onPress}
        ></MaterialCommunityIcons>
    );
};
//#endregion
