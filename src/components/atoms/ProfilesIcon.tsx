//#region Import Modules
import React, { FunctionComponent } from "react";

import { TemplateIcon, TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type ProfilesIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const ProfilesIcon: FunctionComponent<ProfilesIconProps> = (
    props: ProfilesIconProps
) => {
    return (
        <TemplateIcon {...props} name={"format-list-checkbox"}></TemplateIcon>
    );
};
//#endregion
