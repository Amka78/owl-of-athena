//#region Import Modules
import * as d3 from "d3";
import sortBy from "lodash/sortBy";
import React, { FC } from "react";
import { ViewStyle } from "react-native";
import { Svg } from "react-native-svg";

import { AuroraEvent } from "../../sdk/models";
import { Margin } from "./Chart";
//#endregion

export type Axis = {
    color: string;
    label?: string;
    labelSize?: number;
    padding?: number;
    scale?: number | Date;
};
//#region Export Types
export type ChartCoreProps = {
    children?: React.ReactNode;
    defs?: React.ReactNode;
    svgStyle?: ViewStyle;
    width: number;
    height: number;
    axisMargin?: Margin;
    yAxis?: Axis;
    xAxis?: Axis;
    xScaleDomain?: (number | Date | { valueOf(): number })[];
    dataBins?: number[];
    dataBinThreshold?: number;
    clipToRange?: boolean;
};
//#endregion

//#region FC
export const ChartCore: FC<ChartCoreProps> = (props: ChartCoreProps) => {
    const margin = getMargin(props.svgStyle);

    const chartWidth = getChartWidth(props.width, margin as Margin);
    const chartHeight = getChartHeight(props.height, margin as Margin);

    return (
        <Svg width={chartWidth} height={chartHeight} style={props.svgStyle}>
            {props.defs}
            {props.children}
        </Svg>
    );
};
//#endregion

//#region Export Functions
export const getChartWidth = (width: number, margin: Margin): number => {
    return width - margin.left - margin.right;
};

export const getChartHeight = (height: number, margin: Margin): number => {
    return height - margin.top - margin.bottom;
};

export const getMargin = (svgStyle?: ViewStyle): Margin => {
    return {
        left: svgStyle?.marginLeft ? svgStyle.marginLeft : 0,
        right: svgStyle?.marginRight ? svgStyle.marginRight : 0,
        top: svgStyle?.marginTop ? svgStyle.marginTop : 0,
        bottom: svgStyle?.marginBottom ? svgStyle.marginBottom : 0,
    } as Margin;
};

export const getXScale = (
    range: number[],
    domain: (number | Date | { valueOf(): number })[]
): d3.ScaleTime<number, number> => {
    const scaleX = d3.scaleTime().range(range);
    scaleX.nice();
    if (domain.length == 2) {
        scaleX.domain(domain);
    }
    return scaleX;
};

export const getYScale = (
    range: number[],
    domain: (number | Date | { valueOf(): number })[]
): d3.ScaleLinear<number, number> => {
    const scaleY = d3.scaleLinear().range(range);
    scaleY.nice();

    if (domain.length == 2) {
        scaleY.domain(domain);
    }
    return scaleY;
};

export const getXChartRange = (
    chartWidth: number,
    axisMargin?: Margin
): number[] => {
    if (axisMargin) {
        return [axisMargin.left, chartWidth - axisMargin.right];
    } else {
        return [0, chartWidth];
    }
};

export const getYChartRange = (
    chartHeight: number,
    axisMargin?: Margin
): number[] => {
    if (axisMargin) {
        return [chartHeight - axisMargin.bottom, axisMargin!.top];
    } else {
        return [chartHeight, 0];
    }
};

export const getData = (
    source: AuroraEvent[],
    dataBins: number[],
    dataBinThreshold: number,
    scaleXDomain: number[]
): AuroraEvent[] => {
    const bin = getCurrentBin(dataBins, dataBinThreshold, scaleXDomain);

    if (!bin) return source;

    const filteredData = [];

    for (const datum of source) {
        if (!datum.bins) {
            filteredData.push(datum);
            continue;
        }

        if (typeof datum.bins[bin] != "undefined") {
            filteredData.push(
                Object.assign({}, datum, { flags: datum.bins[bin] })
            );
            continue;
        }
    }

    return filteredData;
};

export const getCurrentBin = (
    dataBins: number[],
    dataBinThreshold: number,
    scaleXDomain: number[]
): number => {
    if (!dataBins.length) return 0;

    const minutesVisible = (scaleXDomain[1] - scaleXDomain[0]) / 1000 / 60;

    if (minutesVisible < dataBinThreshold) return 0;

    if (dataBins.length == 1) return dataBins[0];

    const bins = sortBy(dataBins);

    for (let i = 1; i < bins.length; i++) {
        if (minutesVisible / bins[i] < dataBinThreshold!) {
            return bins[i - 1];
        }
    }

    return bins[bins.length - 1];
};
//#endregion
