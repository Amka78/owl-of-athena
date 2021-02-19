//#region Import Modules
import React, { FunctionComponent } from "react";
import { IconProps } from "react-native-vector-icons/Icon";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
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
            name={"logout"}
        ></MaterialCommunityIcons>
    );
};
//#endregion
