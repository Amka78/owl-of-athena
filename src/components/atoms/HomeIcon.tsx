//#region Import Modules
import React, { FunctionComponent } from "react";
import { TemplateIcon, TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type HomeIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const HomeIcon: FunctionComponent<HomeIconProps> = (
    props: HomeIconProps
) => {
    return <TemplateIcon {...props} name={"alarm-check"}></TemplateIcon>;
};
//#endregion
