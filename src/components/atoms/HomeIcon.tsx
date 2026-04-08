//#region Import Modules
import React, { type FunctionComponent } from "react";
import { TemplateIcon, type TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type HomeIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const HomeIcon: FunctionComponent<HomeIconProps> = (props: HomeIconProps) => {
    return <TemplateIcon {...props} name={"alarm-check"}></TemplateIcon>;
};
//#endregion
