//#region Import Modules
import React, { FunctionComponent } from "react";
import { IconProps } from "react-native-vector-icons/Icon";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Dimens } from "../../constants";
//#endregion

//#region Types
export type LogoutIconProps = Omit<IconProps, "name">;
//#endregion

//#region Component
export const LogoutIcon: FunctionComponent<LogoutIconProps> = (
    props: LogoutIconProps
) => {
    return (
        <MaterialCommunityIcons
            {...props}
            size={props.size ? props.size : Dimens.menu_icon_size}
            name={"logout"}
        ></MaterialCommunityIcons>
    );
};
//#endregion
