//#region Import Modules

import { MaterialCommunityIcons } from "@expo/vector-icons";
import type React from "react";
import type { FunctionComponent } from "react";
import { Colors } from "../../constants";

//#endregion

//#region Types
type MaterialIconProps = React.ComponentProps<typeof MaterialCommunityIcons>;

export type TemplateIconProps = Omit<MaterialIconProps, "name" | "color" | "size"> & {
    name?: string;
    color?: string | number;
    size?: number;
    disabled?: boolean;
};
//#endregion

//#region Component
export const TemplateIcon: FunctionComponent<TemplateIconProps> = (props: TemplateIconProps) => {
    const color = props.disabled ? Colors.gray : Colors.white;
    return (
        <MaterialCommunityIcons
            {...(props as unknown as MaterialIconProps)}
            name={props.name as MaterialIconProps["name"]}
            color={(props.color ? props.color : color) as string}
            size={props.size ? props.size : 40}
            onPress={props.disabled === true ? undefined : props.onPress}
        ></MaterialCommunityIcons>
    );
};
//#endregion
