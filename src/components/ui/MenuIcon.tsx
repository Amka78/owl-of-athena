//#region Import Modules
import React, { type FunctionComponent } from "react";

import { TemplateIcon, type TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type MenuIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const MenuIcon: FunctionComponent<MenuIconProps> = (props: MenuIconProps) => {
    return <TemplateIcon {...props} name={"menu"}></TemplateIcon>;
};
//#endregion
