//#region Import Modules
import React, { FunctionComponent } from "react";

import { FieldToggle, ListItem } from "../atoms";
import { ListItemComponentProps } from "../atoms/ListItem";
import { OptionProps } from "./OptionProps";
//#endregion

//#region Types
export type OptionToggleProps = OptionProps & {
    value: string | boolean;
};
//#endregion

//#region Component
export const OptionToggle: FunctionComponent<OptionToggleProps> = (
    props: OptionToggleProps
) => {
    return (
        <ListItem
            {...props}
            right={(rightProps: ListItemComponentProps) => {
                return (
                    <FieldToggle
                        {...props}
                        style={[rightProps.style, { alignSelf: "center" }]}
                    ></FieldToggle>
                );
            }}
        ></ListItem>
    );
};
//#endregion
