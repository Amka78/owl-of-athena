//#region Import Modules
import React, { type FunctionComponent } from "react";

import { TemplateIcon, type TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type DeleteIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const DeleteIcon: FunctionComponent<DeleteIconProps> = (props: DeleteIconProps) => {
    return (
        <TemplateIcon {...props} name={"delete"} size={props.size ? props.size : 25}></TemplateIcon>
    );
};
//#endregion
