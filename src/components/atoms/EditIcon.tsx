//#region Import Modules
import React, { FunctionComponent } from "react";

import { TemplateIcon, TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type EditIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const EditIcon: FunctionComponent<EditIconProps> = (
    props: EditIconProps
) => {
    return <TemplateIcon {...props} name={"pencil"}></TemplateIcon>;
};
//#endregion
