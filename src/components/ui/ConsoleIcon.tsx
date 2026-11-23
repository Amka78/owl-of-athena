//#region Import Modules
import React, { type FunctionComponent } from "react";

import { TemplateIcon, type TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type ConsoleIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const ConsoleIcon: FunctionComponent<ConsoleIconProps> = (props: ConsoleIconProps) => {
    return <TemplateIcon {...props} name={"console"}></TemplateIcon>;
};
//#endregion
