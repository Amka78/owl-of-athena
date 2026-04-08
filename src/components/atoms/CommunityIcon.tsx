//#region Import Modules
import React, { type FunctionComponent } from "react";

import { TemplateIcon, type TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type CommunityIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const CommunityIcon: FunctionComponent<CommunityIconProps> = (props: CommunityIconProps) => {
    return <TemplateIcon {...props} name={"account-check"}></TemplateIcon>;
};
//#endregion
