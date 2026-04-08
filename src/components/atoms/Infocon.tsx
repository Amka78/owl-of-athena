//#region Import Modules
import React, { type FunctionComponent } from "react";

import { TemplateIcon, type TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type InfoIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const InfoIcon: FunctionComponent<InfoIconProps> = (props: InfoIconProps) => {
    return <TemplateIcon {...props} name={"information-outline"}></TemplateIcon>;
};
//#endregion
