//#region Import Modules
import React, { type FunctionComponent } from "react";

import { FieldStreamCheckBoxes, ListItem } from "../atoms";
import type { ListItemComponentProps } from "../atoms/ListItem";
import type { OptionProps } from "./OptionProps";
//#endregion

//#region Types
export type OptionCheckBoxesProps = OptionProps & { value?: number };
//#endregion

//#region Component
export const OptionCheckBoxes: FunctionComponent<OptionCheckBoxesProps> = (
    props: OptionCheckBoxesProps,
) => {
    return (
        <ListItem
            {...props}
            right={(rightProps: ListItemComponentProps) => {
                return (
                    <FieldStreamCheckBoxes
                        {...(props as any)}
                        style={[rightProps.style]}
                    ></FieldStreamCheckBoxes>
                );
            }}
        ></ListItem>
    );
};
//#endregion
