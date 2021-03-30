//#region Import Modules
import Slider from "@react-native-community/slider";
import React, { FunctionComponent } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { SliderField } from "../../sdk/AuroraTypes";
//#endregion

//#region Types
export type FieldSliderProps = {
    value?: number;
    field: SliderField;
    disabled: boolean;
    onValueChange: () => void;
    style?: StyleProp<ViewStyle>;
};
//#endregion

//#region Component
export const FieldSlider: FunctionComponent<FieldSliderProps> = (
    props: FieldSliderProps
) => {
    return (
        <Slider
            {...props}
            maximumValue={props.field.max}
            minimumValue={props.field.min}
            step={props.field.step}
        ></Slider>
    );
};
//#endregion
