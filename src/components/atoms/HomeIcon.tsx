import React, { FunctionComponent } from "react";
//#region Import Modules
import { IconProps } from "react-native-vector-icons/Icon";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//#endregion

//#region Types
export type HomeIconProps = Omit<IconProps, "name">;
//#endregion

//#region Component
export const HomeIcon: FunctionComponent<HomeIconProps> = (
    props: HomeIconProps
) => {
    return (
        <MaterialCommunityIcons
            {...props}
            name={"alarm-check"}
        ></MaterialCommunityIcons>
    );
};
//#endregion
