//#region Import Modules
import React, { type FunctionComponent } from "react";
import { ListItem } from "../ui";
import type { ListItemComponentProps } from "../ui/ListItem";
import { FieldSlider } from "./FieldSlider";
import type { OptionProps } from "./OptionProps";
//#endregion

//#region Types
export type OptionSliderProps = OptionProps & { value?: number };
//#endregion

//#region Component
export const OptionSlider: FunctionComponent<OptionSliderProps> = (props: OptionSliderProps) => {
    const { isLargeWidth: _isLargeWidth, ...listProps } = props;
    return (
        <ListItem
            {...listProps}
            right={(rightProps: ListItemComponentProps) => {
                return (
                    <FieldSlider
                        {...(listProps as any)}
                        style={[rightProps.style, { alignSelf: "center" }]}
                    ></FieldSlider>
                );
            }}
        ></ListItem>
    );
};
//#endregion
