//#region Import Modules
import React, { type FunctionComponent } from "react";

import { FieldToggle, ListItem } from "../atoms";
import type { ListItemComponentProps } from "../atoms/ListItem";
import type { OptionProps } from "./OptionProps";
//#endregion

//#region Types
export type OptionToggleProps = OptionProps & {
    value?: string | boolean;
};
//#endregion

//#region Component
export const OptionToggle: FunctionComponent<OptionToggleProps> = (props: OptionToggleProps) => {
    const { isLargeWidth: _isLargeWidth, ...listProps } = props;
    return (
        <ListItem
            {...listProps}
            right={(rightProps: ListItemComponentProps) => {
                return (
                    <FieldToggle
                        {...(listProps as any)}
                        style={[rightProps.style, { alignSelf: "center" }]}
                    ></FieldToggle>
                );
            }}
        ></ListItem>
    );
};
//#endregion
