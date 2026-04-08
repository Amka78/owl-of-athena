//#region Import Modules
import React, { type FunctionComponent } from "react";

import { FieldTime, ListItem } from "../atoms";
import type { ListItemComponentProps } from "../atoms/ListItem";
import type { OptionProps } from "./OptionProps";
//#endregion

//#region Types
export type OptionTimeProps = OptionProps & {
    value: string | boolean;
};
//#endregion

//#region Component
export const OptionTime: FunctionComponent<OptionTimeProps> = (props: OptionTimeProps) => {
    return (
        <ListItem
            {...props}
            right={(rightProps: ListItemComponentProps) => {
                return (
                    <FieldTime
                        {...(props as any)}
                        style={[rightProps.style, { alignSelf: "center" }]}
                    ></FieldTime>
                );
            }}
        ></ListItem>
    );
};
//#endregion
