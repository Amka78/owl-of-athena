//#region Import Modules
import React, { FunctionComponent } from "react";

import { TemplateIcon, TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type InfoIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const InfoIcon: FunctionComponent<InfoIconProps> = (
    props: InfoIconProps
) => {
    return <TemplateIcon {...props} name={"pencil"}></TemplateIcon>;
};
//#endregion
