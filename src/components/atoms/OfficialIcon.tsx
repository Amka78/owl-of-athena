//#region Import Modules
import React, { type FunctionComponent } from "react";

import { TemplateIcon, type TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type OfficialIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const OfficialIcon: FunctionComponent<OfficialIconProps> = (props: OfficialIconProps) => {
    return <TemplateIcon {...props} name={"domain"}></TemplateIcon>;
};
//#endregion
