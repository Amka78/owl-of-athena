//#region Import Modules
import * as d3 from "d3";
import moment from "moment";
import React, { FC } from "react";
import { Defs, G, LinearGradient, Path, Stop, Text } from "react-native-svg";

import { Colors } from "../../constants";
import { AuroraEvent } from "../../sdk/models";
import {
    Axis,
    ChartCore,
    ChartCoreProps,
    getChartHeight,
    getChartWidth,
    getData,
    getMargin,
    getXChartRange,
    getXScale,
    getYChartRange,
    getYScale,
} from "./ChartCore";
import { XAxisBottomLine } from "./XAxisBottomLine";
import { XAxisTopLine } from "./XAxisTopLine";
import { ClippedG } from "./ClippedG";
//#endregion

//#region Export Types
export type TickInterval = "hour" | "default";
export type ChartSleepProps = ChartCoreProps & {
    tickInterval: TickInterval;
    sleep: Array<AuroraEvent>;
    totalSleepHour: number;
};
//#endregion

//#region Constants
const sleepStageLabels = ["", "Deep", "Light", "REM", "Awake"];
const sleepStageColors = [
    Colors.blue,
    Colors.purple,
    Colors.teal,
    Colors.light_orange,
    Colors.yellow,
];
const sleepStageMapping = [0, 4, 2, 1, 3];
//#endregion
export const ChartSleep: FC<ChartSleepProps> = (props: ChartSleepProps) => {
    const gradientId = "gradient-" + Math.floor(Math.random() * 1000 + 1);

    const margin = getMargin(props.svgStyle);
    const chartWidth = getChartWidth(props.width, margin);
    const chartHeight = getChartHeight(props.height, margin);

    const yAxisLabelSize = props.yAxis?.labelSize ? props.yAxis.labelSize : 15;
    const yAxisLabelPadding = props.yAxis?.padding ? props.yAxis.padding : 0;
    const xAxisLabelSize = props.xAxis?.labelSize ? props.xAxis.labelSize : 15;
    const xAxisLabelPadding = props.xAxis?.padding ? props.xAxis.padding : 0;
    const axisMargin = { top: 32, right: 32, bottom: 48, left: 100 };

    const xScaleDomain = props.xScaleDomain as number[];
    const sleep = getData(
        props.sleep,
        props.dataBins!,
        props.dataBinThreshold!,
        xScaleDomain
    );

    //if we have an odd number of events
    //let's create an additional one at the end
    if (sleep.length) {
        sleep.unshift(
            Object.assign({}, sleep[0], {
                time: 0,
                eventAt: xScaleDomain![0],
            })
        );
        sleep.push(
            Object.assign({}, sleep[sleep.length - 1], {
                eventAt: props.xScaleDomain![1],
                time: xScaleDomain![1] - xScaleDomain![0],
            })
        );
    }

    const yChartRange = getYChartRange(chartHeight, axisMargin);
    const yScale = getYScale(yChartRange, [0, sleepStageLabels.length - 1]);
    const xChartRange = getXChartRange(chartWidth, axisMargin);
    const xScale = getXScale(xChartRange, [
        sleep[0].eventAt,
        sleep[sleep.length - 1].eventAt,
    ]);

    const xAxisLabels = buildXAxisLabels(
        xScale,
        props.tickInterval,
        props.totalSleepHour
    );
    const yAxisLabels = buildYAxisLabels(yScale);
    // @ts-ignore
    const line = d3
        .line<AuroraEvent>()
        .curve(d3.curveStepAfter)
        .x((d) => xScale(d.eventAt))
        .y((d) => yScale(sleepStageMapping[d.flags]))(sleep);

    const lineProps = {
        color: Colors.third_accent_color,
        width: chartWidth,
        height: chartHeight - axisMargin.bottom,
    };
    return (
        <ChartCore
            {...props}
            defs={
                <Defs>
                    <LinearGradient
                        id={gradientId}
                        x1={"0%"}
                        x2={"0%"}
                        y2={"100%"}
                        gradientUnits={"userSpaceOnUse"}
                    >
                        <Stop
                            offset={"0%"}
                            stopColor={sleepStageColors[4]}
                            stopOpacity={1}
                        ></Stop>
                        <Stop
                            offset={"25%"}
                            stopColor={sleepStageColors[3]}
                            stopOpacity={1}
                        ></Stop>
                        <Stop
                            offset={"50%"}
                            stopColor={sleepStageColors[2]}
                            stopOpacity={1}
                        ></Stop>
                        <Stop
                            offset={"75%"}
                            stopColor={sleepStageColors[1]}
                            stopOpacity={1}
                        ></Stop>
                        <Stop
                            offset={"100%"}
                            stopColor={sleepStageColors[0]}
                            stopOpacity={1}
                        ></Stop>
                    </LinearGradient>
                </Defs>
            }
        >
            <G>
                {yAxisLabels.map((value: Axis, index: number) => {
                    return (
                        <Text
                            key={index}
                            x={15}
                            y={yScale(value.scale!)}
                            fontSize={yAxisLabelSize}
                            fill={value.color}
                            transform={`translate(-${yAxisLabelPadding}, 0)`}
                        >
                            {value.label}
                        </Text>
                    );
                })}
            </G>
            <XAxisTopLine {...lineProps}></XAxisTopLine>
            <ClippedG yChartRange={yChartRange} xChartRange={xChartRange}>
                <Path
                    strokeLinejoin={"round"}
                    strokeWidth={2}
                    stroke={`url(#${gradientId})`}
                    fill={"none"}
                    d={line!}
                />
            </ClippedG>
            <XAxisBottomLine {...lineProps}></XAxisBottomLine>
            <G>
                {xAxisLabels.map((value: Axis, index: number) => {
                    return (
                        <Text
                            key={index}
                            x={xScale(value.scale!)}
                            y={chartHeight - 25}
                            fontSize={xAxisLabelSize}
                            fill={value.color}
                            transform={`translate(${xAxisLabelPadding}, 0)`}
                        >
                            {value.label}
                        </Text>
                    );
                })}
            </G>
        </ChartCore>
    );
};
//#region Private Fields
const buildXAxisLabels = (
    scaleX: d3.ScaleTime<number, number>,
    tickInterval: "default" | "hour",
    totalSleepHour: number
): Array<Axis> => {
    const xAxisLabels = new Array<Axis>();
    let xAxisTicks: Date[] | undefined = undefined;

    if (tickInterval === "default") {
        xAxisTicks = scaleX.ticks();
    } else {
        xAxisTicks = scaleX.ticks(totalSleepHour);
    }

    xAxisTicks.map((value: Date) => {
        xAxisLabels.push({
            color: Colors.white,
            label:
                tickInterval === "default"
                    ? moment(value)
                          .utc()
                          .format("h:mm a")
                          .replace(":00", "")
                          .slice(0, -1)
                    : moment(value).utc().format("h"),
            scale: value,
        });
    });
    return xAxisLabels;
};

const buildYAxisLabels = (
    scaleY: d3.ScaleLinear<number, number>
): Array<Axis> => {
    const yAxisLabels = new Array<Axis>();
    const yAxisTicks = scaleY.ticks(sleepStageLabels.length - 1);

    yAxisTicks.map((value: number, index: number) => {
        yAxisLabels.push({
            color: sleepStageColors[index],
            label: sleepStageLabels[index],
            scale: value,
        });
    });
    return yAxisLabels;
};
