//#region Import Modules
import moment from "moment";
import React, { type FC } from "react";
import { Circle, G, Line, Path, Rect, Text as SvgText } from "react-native-svg";

import { Colors } from "../../constants";
import type { AuroraEvent } from "../../sdk/models";
import { ChartCore, getXScale } from "./ChartCore";
import { ClippedG } from "./ClippedG";
//#endregion

//#region Types
export type SessionTimelineChartProps = {
    width: number;
    height: number;
    scaleXDomain: number[];
    asleepAt?: number;
    awakeAt?: number;
    stimEvents: AuroraEvent[];
    awakeningEvents: AuroraEvent[];
    buttonEvents: AuroraEvent[];
    showStimEvents: boolean;
    showAwakeningEvents: boolean;
    showButtonEvents: boolean;
};
//#endregion

//#region Constants
const AXIS_LEFT = 100;
const AXIS_RIGHT = 32;
const TOP = 20;
const BOTTOM = 24;
//#endregion

//#region Component
export const SessionTimelineChart: FC<SessionTimelineChartProps> = (
    props: SessionTimelineChartProps,
) => {
    if (props.width <= 0 || props.height <= 0) return null;

    const chartWidth = props.width;
    const chartHeight = props.height;
    const xChartRange = [
        chartWidth > AXIS_LEFT + AXIS_RIGHT ? AXIS_LEFT : 0,
        chartWidth - AXIS_RIGHT,
    ];
    const xScale = getXScale(xChartRange, props.scaleXDomain);
    const centerY = TOP + (chartHeight - TOP - BOTTOM) / 2;
    const xTicks = xScale
        .ticks(6)
        .filter(
            (date) =>
                date.getTime() >= props.scaleXDomain[0] && date.getTime() <= props.scaleXDomain[1],
        );

    const stimEvents = props.showStimEvents ? props.stimEvents : [];
    const awakeningEvents = props.showAwakeningEvents ? props.awakeningEvents : [];
    const buttonEvents = props.showButtonEvents ? props.buttonEvents : [];

    return (
        <ChartCore width={chartWidth} height={chartHeight}>
            <Line
                x1={xChartRange[0]}
                x2={xChartRange[1]}
                y1={centerY}
                y2={centerY}
                stroke={Colors.third_accent_color}
                strokeWidth={1}
            ></Line>

            {xTicks.map((date, index) => (
                <SvgText
                    key={`tick-${index}`}
                    x={xScale(date)}
                    y={chartHeight - 6}
                    fill={Colors.gray}
                    fontSize={10}
                    textAnchor={"middle"}
                >
                    {moment(date).utc().format("h a")}
                </SvgText>
            ))}

            {props.asleepAt !== undefined && (
                <TimelineBoundary
                    x={xScale(props.asleepAt)}
                    date={props.asleepAt}
                    color={Colors.teal}
                    height={chartHeight}
                ></TimelineBoundary>
            )}
            {props.awakeAt !== undefined && (
                <TimelineBoundary
                    x={xScale(props.awakeAt)}
                    date={props.awakeAt}
                    color={Colors.white}
                    height={chartHeight}
                ></TimelineBoundary>
            )}

            <ClippedG xChartRange={xChartRange} yChartRange={[chartHeight, 0]}>
                {stimEvents.map((event, index) => {
                    const x = xScale(event.eventAt);

                    return (
                        <G key={`stim-${index}`}>
                            <Path
                                d={`M ${x} ${centerY - 12} L ${x - 5} ${centerY - 3} L ${x + 5} ${centerY - 3} Z`}
                                fill={Colors.light_orange}
                            ></Path>
                            {event.flags > 1 && (
                                <SvgText
                                    x={x}
                                    y={centerY - 15}
                                    fill={Colors.light_orange}
                                    fontSize={9}
                                    textAnchor={"middle"}
                                >
                                    {event.flags}
                                </SvgText>
                            )}
                        </G>
                    );
                })}

                {awakeningEvents.map((event, index) => (
                    <Circle
                        key={`awakening-${index}`}
                        cx={xScale(event.eventAt)}
                        cy={centerY + 10}
                        r={4}
                        fill={Colors.yellow}
                    ></Circle>
                ))}

                {buttonEvents.map((event, index) => (
                    <Rect
                        key={`button-${index}`}
                        x={xScale(event.eventAt) - 4}
                        y={centerY + 6}
                        width={8}
                        height={8}
                        fill={Colors.cyan}
                    ></Rect>
                ))}
            </ClippedG>
        </ChartCore>
    );
};
//#endregion

//#region Private Components
const TimelineBoundary: FC<{ x: number; date: number; color: string; height: number }> = (
    props,
) => {
    return (
        <G>
            <Line
                x1={props.x}
                x2={props.x}
                y1={TOP}
                y2={props.height - BOTTOM}
                stroke={props.color}
                strokeWidth={1}
                strokeDasharray={"3,3"}
            ></Line>
            <SvgText x={props.x} y={10} fill={props.color} fontSize={10} textAnchor={"middle"}>
                {moment(props.date).utc().format("h:mm a")}
            </SvgText>
        </G>
    );
};
//#endregion
