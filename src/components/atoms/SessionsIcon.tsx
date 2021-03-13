//#region Import Modules
import React, { FunctionComponent } from "react";

import { TemplateIcon, TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type SessionsIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const SessionsIcon: FunctionComponent<SessionsIconProps> = (
    props: SessionsIconProps
) => {
    return <TemplateIcon {...props} name={"blur"}></TemplateIcon>;
};
//#endregion
