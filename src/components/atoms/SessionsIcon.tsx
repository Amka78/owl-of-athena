import React, { FunctionComponent } from "react";
//#region Import Modules
import { IconProps } from "react-native-vector-icons/Icon";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//#endregion

//#region Types
export type SessionsIconProps = Omit<IconProps, "name">;
//#endregion

//#region Component
export const SessionsIcon: FunctionComponent<SessionsIconProps> = (
    props: SessionsIconProps
) => {
    return (
        <MaterialCommunityIcons
            {...props}
            name={"blur"}
        ></MaterialCommunityIcons>
    );
};
//#endregion
