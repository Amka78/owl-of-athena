//#region Import Modules
import React, { FunctionComponent } from "react";

import { TemplateIcon, TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type StarIconProps = Omit<TemplateIconProps, "name"> & {
    starred: boolean;
};
//#endregion

//#region Component
export const StarIcon: FunctionComponent<StarIconProps> = (
    props: StarIconProps
) => {
    return (
        <TemplateIcon
            {...props}
            name={props.starred ? "star" : "star-outline"}
            size={props.size ? props.size : 25}
        ></TemplateIcon>
    );
};
//#endregion
