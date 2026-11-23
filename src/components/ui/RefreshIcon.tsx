//#region Import Modules
import React, { type FunctionComponent } from "react";

import { TemplateIcon, type TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type RefreshIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const RefreshIcon: FunctionComponent<RefreshIconProps> = (props: RefreshIconProps) => {
    return <TemplateIcon {...props} name={"refresh"}></TemplateIcon>;
};
//#endregion
