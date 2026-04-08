//#region Import Modules
import React, { type FunctionComponent } from "react";

import { TemplateIcon, type TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type SessionsIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const SessionsIcon: FunctionComponent<SessionsIconProps> = (props: SessionsIconProps) => {
    return <TemplateIcon {...props} name={"blur"}></TemplateIcon>;
};
//#endregion
