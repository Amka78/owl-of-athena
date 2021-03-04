//#region Import Modules
import React, { FunctionComponent } from "react";
import { TemplateIcon, TemplateIconProps } from "../atoms/TemplateIcon";
//#endregion

//#region Types
export type FilterIconProps = Omit<TemplateIconProps, "name">;
//#endregion

//#region Component
export const FilterIcon: FunctionComponent<FilterIconProps> = (
    props: FilterIconProps
) => {
    return <TemplateIcon {...props} name={"filter-variant"}></TemplateIcon>;
};
//#endregion
