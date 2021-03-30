//#region Import Modules
import React, { FunctionComponent } from "react";

import { FieldStreamCheckBoxes, ListItem } from "../atoms";
import { ListItemComponentProps } from "../atoms/ListItem";
import { OptionProps } from "./OptionProps";
//#endregion

//#region Types
export type OptionCheckBoxesProps = OptionProps & { value?: number };
//#endregion

//#region Component
export const OptionCheckBoxes: FunctionComponent<OptionProps> = (
    props: OptionProps
) => {
    return (
        <ListItem
            {...props}
            right={(rightProps: ListItemComponentProps) => {
                return (
                    <FieldStreamCheckBoxes
                        {...props}
                        style={[rightProps.style]}
                    ></FieldStreamCheckBoxes>
                );
            }}
        ></ListItem>
    );
};
//#endregion
