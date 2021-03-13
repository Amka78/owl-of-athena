//#region Import Modules
import React, { FunctionComponent } from "react";

import { TemplateIcon, TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type RefreshIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const RefreshIcon: FunctionComponent<RefreshIconProps> = (
    props: RefreshIconProps
) => {
    return <TemplateIcon {...props} name={"refresh"}></TemplateIcon>;
};
//#endregion
