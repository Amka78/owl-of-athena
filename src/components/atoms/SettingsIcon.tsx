import React, { FunctionComponent } from "react";
//#region Import Modules
import { IconProps } from "react-native-vector-icons/Icon";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//#endregion

//#region Types
export type SettingsIconProps = Omit<IconProps, "name">;
//#endregion

//#region Component
export const SettingsIcon: FunctionComponent<SettingsIconProps> = (
    props: SettingsIconProps
) => {
    return (
        <MaterialCommunityIcons
            {...props}
            name={"cog"}
        ></MaterialCommunityIcons>
    );
};
//#endregion
