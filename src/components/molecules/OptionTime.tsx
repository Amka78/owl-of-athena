//#region Import Modules
import React, { FunctionComponent } from "react";

import { FieldTime, ListItem } from "../atoms";
import { ListItemComponentProps } from "../atoms/ListItem";
import { OptionProps } from "./OptionProps";
//#endregion

//#region Types
export type OptionTimeProps = OptionProps & {
    value: string | boolean;
};
//#endregion

//#region Component
export const OptionTime: FunctionComponent<OptionTimeProps> = (
    props: OptionTimeProps
) => {
    return (
        <ListItem
            {...props}
            right={(rightProps: ListItemComponentProps) => {
                return (
                    <FieldTime
                        {...props}
                        style={[rightProps.style, { alignSelf: "center" }]}
                    ></FieldTime>
                );
            }}
        ></ListItem>
    );
};
//#endregion
