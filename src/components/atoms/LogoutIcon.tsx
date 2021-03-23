//#region Import Modules
import React, { FunctionComponent } from "react";

import { Dimens } from "../../constants";
import { TemplateIcon, TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type LogoutIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const LogoutIcon: FunctionComponent<LogoutIconProps> = (
    props: LogoutIconProps
) => {
    return (
        <TemplateIcon
            {...props}
            size={props.size ? props.size : Dimens.menu_icon_size}
            name={"logout"}
        ></TemplateIcon>
    );
};
//#endregion
