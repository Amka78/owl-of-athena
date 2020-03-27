import React, { FunctionComponent } from "react";
import { View, ViewStyle } from "react-native";
import { ProgressCircle as ChartsProgressCircle } from "react-native-svg-charts";
import { Text } from "react-native-svg";
import { Colors } from "../constants";
export type ProgressCircleProps = {
    style?: ViewStyle;
    value: number;
    labelFontSize?: number;
};
export const ProgressCircle: FunctionComponent<ProgressCircleProps> = (
    props: ProgressCircleProps
) => {
    return (
        <View>
            <ChartsProgressCircle
                style={[
                    {
                        alignSelf: "center",
                        height: 60,
                        width: 60
                    },
                    props.style
                ]}
                backgroundColor={Colors.purple}
                strokeWidth={3}
                progress={props.value / 100}
                progressColor={Colors.teal}
            >
                <Text
                    fill={Colors.teal}
                    alignmentBaseline={"middle"}
                    textAnchor={"middle"}
                    fontSize={props.labelFontSize ? props.labelFontSize : 25}
                >
                    {props.value}
                </Text>
            </ChartsProgressCircle>
        </View>
    );
};
