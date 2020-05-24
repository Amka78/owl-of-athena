import React, { FunctionComponent } from "react";
import { View, ViewStyle } from "react-native";

import { CommonStyles } from "../styles";

type StandardViewProps = {
    children: React.ReactNode;
    standardViewStyle?: ViewStyle;
};
export const StandardView: FunctionComponent<StandardViewProps> = (
    props: StandardViewProps
) => {
    return (
        <View style={CommonStyles.rootContainer}>
            <View style={[CommonStyles.standardView, props.standardViewStyle]}>
                {props.children}
            </View>
        </View>
    );
};
