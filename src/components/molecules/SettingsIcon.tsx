//#region Import Modules
import React, { FunctionComponent } from "react";
import { TemplateIcon, TemplateIconProps } from "../atoms/TemplateIcon";
//#endregion

//#region Types
export type SettingsIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const SettingsIcon: FunctionComponent<SettingsIconProps> = (
    props: SettingsIconProps
) => {
    return <TemplateIcon {...props} name={"cog"}></TemplateIcon>;
};
//#endregion
