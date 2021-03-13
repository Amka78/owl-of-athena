//#region Import Modules
import React, { FunctionComponent } from "react";

import { TemplateIcon, TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type PrivateIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const PrivateIcon: FunctionComponent<PrivateIconProps> = (
    props: PrivateIconProps
) => {
    return <TemplateIcon {...props} name={"home"}></TemplateIcon>;
};
//#endregio
