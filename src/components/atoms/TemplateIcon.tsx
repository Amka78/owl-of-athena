//#region Import Modules
import React, { FunctionComponent } from "react";
import { IconProps } from "react-native-vector-icons/Icon";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../constants";
//#endregion

//#region Types
export type TemplateIconProps = IconProps & { disabled?: boolean };
//#endregion

//#region Component
export const TemplateIcon: FunctionComponent<TemplateIconProps> = (
    props: TemplateIconProps
) => {
    const color = props.disabled ? Colors.gray : Colors.white;
    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        <MaterialCommunityIcons
            {...props}
            color={props.color ? props.color : color}
            size={props.size ? props.size : 40}
            onPress={props.disabled === true ? undefined : props.onPress}
        ></MaterialCommunityIcons>
    );
};
//#endregion
