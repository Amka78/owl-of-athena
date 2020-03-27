import React, { FunctionComponent } from "react";

import { View } from "react-native";
import { Circle, Svg, Text } from "react-native-svg";
import { Colors, Message, MessageKeys } from "../constants";
export type LabeledCircleType = {
    x: number;
    y: number;
    color: string;
    label: string;
    duration: { hours: number; minutes: number };
};
export const LabeledCircle: FunctionComponent<LabeledCircleType> = (
    props: LabeledCircleType
) => {
    return (
        <Svg>
            <Circle
                cx={props.x}
                cy={props.y}
                r={"5%"}
                fill={Colors.semi_transparent}
                stroke={props.color}
            ></Circle>
            <Text
                x={props.x + 40}
                y={props.y}
                fill={Colors.white}
                textAnchor={"start"}
                alignmentBaseline={"center"}
                fontSize={15}
            >{`${Message.get(props.label, [
                `${
                    props.duration.hours > 0 ? props.duration.hours + "h" : ""
                } ${("00" + props.duration.minutes).slice(2) + "m"}`
            ])}`}</Text>
        </Svg>
    );
};
