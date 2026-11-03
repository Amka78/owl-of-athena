//#region Import Modules
import React, { type FunctionComponent } from "react";
import { View } from "react-native";

import type { StimLedValue } from "../../sdk/AuroraTypes";
import { FieldLedEffect } from "../atoms/FieldLedEffect";
import { ListItem } from "../atoms/ListItem";
import type { OptionProps } from "./OptionProps";
//#endregion

//#region Types
export type OptionLedEffectProps = OptionProps & {
    value?: StimLedValue | string;
};
//#endregion

//#region Component
export const OptionLedEffect: FunctionComponent<OptionLedEffectProps> = (
    props: OptionLedEffectProps,
) => {
    return (
        <View>
            <ListItem
                title={props.title}
                description={props.description}
                left={props.left}
                disabled={props.disabled}
            ></ListItem>
            <FieldLedEffect
                value={props.value}
                disabled={props.disabled}
                onPreviewEffectPress={(value): void => props.onPreviewEffectPress?.(value)}
                onValueChange={(value): void => props.onValueChange(value)}
            ></FieldLedEffect>
        </View>
    );
};
//#endregion
