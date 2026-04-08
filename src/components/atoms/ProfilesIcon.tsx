//#region Import Modules
import React, { type FunctionComponent } from "react";

import { TemplateIcon, type TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type ProfilesIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const ProfilesIcon: FunctionComponent<ProfilesIconProps> = (props: ProfilesIconProps) => {
    return <TemplateIcon {...props} name={"format-list-checkbox"}></TemplateIcon>;
};
//#endregion
