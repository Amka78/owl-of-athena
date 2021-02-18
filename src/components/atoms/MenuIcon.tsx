import React, { FunctionComponent } from "react";
//#region Import Modules
import { IconProps } from "react-native-vector-icons/Icon";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//#endregion

//#region Types
export type MenuIconProps = Omit<IconProps, "name">;
//#endregion

//#region Component
export const MenuIcon: FunctionComponent<MenuIconProps> = (
    props: MenuIconProps
) => {
    return (
        <MaterialCommunityIcons
            {...props}
            name={"menu"}
        ></MaterialCommunityIcons>
    );
};
//#endregion
