//#region Import Modules
import React, { FC } from "react";
import { G, Line, Text } from "react-native-svg";

import { Colors } from "../../constants";
import { AuroraEvent } from "../../sdk/models";
import {
    ChartCore,
    ChartCoreProps,
    getChartHeight,
    getXChartRange,
    getYChartRange,
    getChartWidth,
    getData,
    getMargin,
    getXScale,
    getYScale,
} from "./ChartCore";
import { XAxisBottomLine } from "./XAxisBottomLine";
import { XAxisTopLine } from "./XAxisTopLine";
import { ClippedG } from "./ClippedG";
//#endregion

//#region Export Types
export type ChartMovementProps = ChartCoreProps & {
    movementTickColor?: string;
    movementLabelColor?: string;
    movement: AuroraEvent[];
};
//#endregion

export const ChartMovement: FC<ChartMovementProps> = (
    props: ChartMovementProps
) => {
    const margin = getMargin(props.svgStyle);
    const chatWidth = getChartWidth(props.width, margin);
    const chartHeight = getChartHeight(props.height, margin);
    const movementTickSize = chartHeight / 8;

    const yAxisLabelSize = props.yAxis?.labelSize ? props.yAxis.labelSize : 15;
    const yAxisPadding = props.yAxis?.padding ? props.yAxis.padding : 0;
    const movementTickColor = props.movementTickColor
        ? props.movementTickColor
        : Colors.light_orange;
    const axisMargin = { top: 0, right: 32, bottom: 0, left: 100 };

    const xChartRange = getXChartRange(chatWidth, axisMargin);
    const xScale = getXScale(xChartRange, props.xScaleDomain!);
    const chartCenter = chartHeight / 2;
    const yChartRange = getYChartRange(chartHeight, axisMargin);
    const yScale = getYScale(yChartRange, [-chartCenter, chartCenter]);

    const movement = getData(
        props.movement,
        props.dataBins!,
        props.dataBinThreshold!,
        props.xScaleDomain! as number[]
    );

    const movementLabelColor = props.movementLabelColor
        ? props.movementLabelColor
        : Colors.white;

    const lineProps = {
        color: Colors.third_accent_color,
        width: chatWidth,
        height: chartHeight,
    };
    return (
        <ChartCore {...props}>
            <G>
                <Text
                    x={0}
                    y={chartCenter}
                    fontSize={yAxisLabelSize}
                    fill={movementLabelColor}
                    transform={`translate(-${yAxisPadding}, 0)`}
                >
                    Movement
                </Text>
            </G>
            <XAxisTopLine {...lineProps}></XAxisTopLine>
            <ClippedG xChartRange={xChartRange} yChartRange={yChartRange}>
                {movement.map((value: AuroraEvent, index: number) => {
                    return (
                        <Line
                            key={index}
                            stroke={movementTickColor}
                            x1={xScale(value.eventAt)}
                            y1={yScale(
                                -Math.floor(value.flags + 0.25) *
                                    movementTickSize
                            )}
                            x2={xScale(value.eventAt)}
                            y2={yScale(
                                Math.floor(value.flags + 0.25) *
                                    movementTickSize
                            )}
                        ></Line>
                    );
                })}
            </ClippedG>
            <XAxisBottomLine {...lineProps}></XAxisBottomLine>
        </ChartCore>
    );
};
