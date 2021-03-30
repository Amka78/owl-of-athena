//#region Import Modules
import React, { FunctionComponent } from "react";

import { FieldSlider, ListItem } from "../atoms";
import { ListItemComponentProps } from "../atoms/ListItem";
import { OptionProps } from "./OptionProps";
//#endregion

//#region Types
export type OptionSliderProps = OptionProps & { value?: number };
//#endregion

//#region Component
export const OptionSlider: FunctionComponent<OptionProps> = (
    props: OptionProps
) => {
    return (
        <ListItem
            {...props}
            right={(rightProps: ListItemComponentProps) => {
                return (
                    <FieldSlider
                        {...props}
                        style={[rightProps.style, { alignSelf: "center" }]}
                    ></FieldSlider>
                );
            }}
        ></ListItem>
    );
};
//#endregion
