import React, { FunctionComponent } from "react";
//#region Import Modules
import { TemplateIcon, TemplateIconProps } from "../atoms/TemplateIcon";
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
