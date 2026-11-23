//#region Import Modules
import React, { type FunctionComponent } from "react";

import { TemplateIcon, type TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type EditIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const EditIcon: FunctionComponent<EditIconProps> = (props: EditIconProps) => {
    return <TemplateIcon {...props} name={"pencil"}></TemplateIcon>;
};
//#endregion
