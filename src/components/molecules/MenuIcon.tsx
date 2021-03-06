//#region Import Modules
import React, { FunctionComponent } from "react";
import { TemplateIcon, TemplateIconProps } from "../atoms/TemplateIcon";
//#endregion

//#region Types
export type MenuIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const MenuIcon: FunctionComponent<MenuIconProps> = (
    props: MenuIconProps
) => {
    return <TemplateIcon {...props} name={"menu"}></TemplateIcon>;
};
//#endregion
