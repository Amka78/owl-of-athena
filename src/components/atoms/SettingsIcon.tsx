//#region Import Modules
import React, { type FunctionComponent } from "react";

import { TemplateIcon, type TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type SettingsIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const SettingsIcon: FunctionComponent<SettingsIconProps> = (props: SettingsIconProps) => {
    return <TemplateIcon {...props} name={"cog"}></TemplateIcon>;
};
//#endregion
