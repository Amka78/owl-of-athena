//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { Dimensions, useWindowDimensions } from "../hooks/useWindowDimensions";
//#endregion

export type ContainerProps = { dimens: Dimensions; children: React.ReactNode };

export const Container: FunctionComponent<ContainerProps> = (
    props: ContainerProps
) => {
    return (
        <View
            style={{
                height: props.dimens.height,
                width: props.dimens.width,
            }}
        >
            {props.children}
        </View>
    );
};
