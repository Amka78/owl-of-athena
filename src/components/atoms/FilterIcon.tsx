//#region Import Modules
import React, { type FunctionComponent } from "react";

import { TemplateIcon, type TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type FilterIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const FilterIcon: FunctionComponent<FilterIconProps> = (props: FilterIconProps) => {
    return <TemplateIcon {...props} name={"filter-variant"}></TemplateIcon>;
};
//#endregion
