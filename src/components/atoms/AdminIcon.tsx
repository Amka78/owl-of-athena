//#region Import Modules
import React, { type FunctionComponent } from "react";

import { TemplateIcon, type TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type AdminIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const AdminIcon: FunctionComponent<AdminIconProps> = (props: AdminIconProps) => {
    return <TemplateIcon {...props} name={"shield-account"}></TemplateIcon>;
};
//#endregion
