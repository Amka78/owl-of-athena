//#region Import Modules
import React, { FunctionComponent } from "react";

import { FieldLedEffect, ListItem } from "../atoms";
import { ListItemComponentProps } from "../atoms/ListItem";
import { OptionProps } from "./OptionProps";
//#endregion

//#region Types
export type OptionLedEffectProps = OptionProps & {
    value: string | boolean;
};
//#endregion

//#region Component
export const OptionLedEffect: FunctionComponent<OptionLedEffectProps> = (
    props: OptionLedEffectProps
) => {
    return (
        <ListItem
            {...props}
            right={(rightProps: ListItemComponentProps) => {
                return (
                    <FieldLedEffect
                        {...props}
                        style={[rightProps.style, { alignSelf: "center" }]}
                    ></FieldLedEffect>
                );
            }}
        ></ListItem>
    );
};
//#endregion
