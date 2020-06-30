//#region Import modules
import * as d3 from "d3";
import React, { FC } from "react";
import { Path, Text } from "react-native-svg";

import { Colors } from "../../constants";
import { ChartCore, ChartCoreProps } from "./ChartCore";
//#endregion

//#region Export Types
export type ChartRadialProgressProps = ChartCoreProps & {
    startAngle?: number;
    bgColor: string;
    fgColor: string;
    valueLabelColor?: string;
    valueLabelSize?: number;
    outerRadius?: number;
    innerRadius?: number;
    value: number;
    minValue?: number;
    maxValue?: number;
    valueLabel: string;
};
//#endregion

export const ChartRadialProgress: FC<ChartRadialProgressProps> = (
    props: ChartRadialProgressProps
) => {
    const valueLabelColor = props.valueLabelColor
        ? props.valueLabelColor
        : Colors.white;

    const valueLabelSize = props.valueLabelSize ? props.valueLabelSize : 12;

    const minValue = props.minValue ? props.minValue : 0;

    const maxValue = props.maxValue ? props.maxValue : 100;

    const startAngle = props.startAngle ? props.startAngle : 0;

    const outerRadius = props.outerRadius ? props.outerRadius : props.width / 2;
    const innerRadius = props.innerRadius ? props.innerRadius : outerRadius - 2;

    const arc = d3.arc();

    arc.startAngle(getRadiansFromDegrees(startAngle))
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    return (
        <ChartCore {...props}>
            <Path
                // @ts-ignore
                d={arc.endAngle(2 * Math.PI)()}
                transform={`translate(${outerRadius}, ${outerRadius})`}
                stroke={props.bgColor}
            ></Path>
            <Text
                x={outerRadius}
                y={outerRadius}
                alignmentBaseline={"middle"}
                textAnchor={"middle"}
                fill={valueLabelColor}
                fontSize={valueLabelSize}
            >
                {props.valueLabel}
            </Text>
            <Path
                //@ts-ignore
                d={arc.endAngle(
                    getRadiansFromProgress(
                        startAngle,
                        props.value,
                        minValue,
                        maxValue
                    )
                )()}
                transform={`translate(${outerRadius}, ${outerRadius})`}
                fill={props.fgColor}
            ></Path>
        </ChartCore>
    );
};

//#region Internal Functions
const getRadiansFromDegrees = (angle: number): number => {
    return (angle * Math.PI) / 180;
};

const getRadiansFromProgress = (
    startAngle: number,
    value: number,
    minValue: number,
    maxValue: number
): number => {
    return (
        getRadiansFromDegrees(startAngle) +
        2 *
            Math.PI *
            Math.min(
                maxValue,
                Math.max(minValue, value / (maxValue - minValue))
            )
    );
};
//#endregion
