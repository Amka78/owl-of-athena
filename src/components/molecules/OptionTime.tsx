//#region Import Modules
import React, { type FunctionComponent } from "react";

import { FieldTime, ListItem } from "../atoms";
import type { ListItemComponentProps } from "../atoms/ListItem";
import type { OptionProps } from "./OptionProps";
//#endregion

//#region Types
export type OptionTimeProps = OptionProps & {
    value?: string | number | boolean;
};
//#endregion

//#region Component
export const OptionTime: FunctionComponent<OptionTimeProps> = (props: OptionTimeProps) => {
    const { isLargeWidth: _isLargeWidth, ...listProps } = props;
    return (
        <ListItem
            {...listProps}
            right={(rightProps: ListItemComponentProps) => {
                return (
                    <FieldTime
                        {...(listProps as any)}
                        style={[rightProps.style, { alignSelf: "center" }]}
                    ></FieldTime>
                );
            }}
        ></ListItem>
    );
};
//#endregion
