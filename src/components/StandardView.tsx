import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { CommonStyles } from "../styles";

type StandardViewProps = {
    children: React.ReactNode;
};
export const StandardView: FunctionComponent<StandardViewProps> = (
    props: StandardViewProps
) => {
    return (
        <View style={CommonStyles.rootContainer}>
            <View style={CommonStyles.standardView}>{props.children}</View>
        </View>
    );
};
