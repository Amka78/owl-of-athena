/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as d3 from "d3";
import React from "react";
import { G, Path, Rect, Text } from "react-native-svg";

import { Colors } from "../../constants";
import {
    ChartCore,
    ChartCoreProps,
    getChartHeight,
    getChartWidth,
    getMargin,
} from "./ChartCore";

export type ChartPieProps = ChartCoreProps & {
    categoryColors: string[];
    categoryLabels: string[];
    categoryLabelSize: number;
    categoryLabelColor: string;
    categoryLabelPadding: number;
    legendPosition: string;
    outerRadius?: number;
    innerRadius?: number;
    categoryPercents: number[];
    percentLabelSize: number;
    percentLabelColorDark: string;
    percentLabelColorLight: string;
};
export default class ChartPie extends React.Component<ChartPieProps, {}> {
    static defaultProps = {
        categoryLabelSize: 15,
        categoryLabelColor: "#929DAF",
        categoryLabelPadding: 32,

        percentLabelSize: 20,
        percentLabelColorDark: Colors.blue,
        percentLabelColorLight: "#d0d0d0",

        clipToRange: false,
        transitionIntro: 0,

        legendPosition: "right",

        categoryColors: d3.schemeCategory10,
        svgStyle: {
            marginLeft: 32,
            marginRight: 32,
            marginTop: 32,
            marginBottom: 32,
        },
    };
    public render(): JSX.Element {
        const {
            categoryColors,
            categoryLabelColor,
            categoryLabelPadding,
            legendPosition,
            percentLabelSize,
        } = this.props;

        const pie = d3.pie();

        pie.padAngle(0.03);

        const margin = getMargin(this.props.svgStyle);
        const chartWidth = getChartWidth(this.props.width, margin);
        const chartHeight = getChartHeight(this.props.height, margin);

        const outerRadius = this.props.outerRadius
            ? this.props.outerRadius
            : chartWidth / 2;
        const innerRadius = this.props.innerRadius
            ? this.props.innerRadius
            : chartWidth / 3;

        console.debug(`outerRadius:${outerRadius}`);
        console.debug(`innerRadius:${innerRadius}`);
        const arc = d3.arc();

        arc.outerRadius(outerRadius).innerRadius(innerRadius);

        console.debug("chartWidth:", chartWidth);
        console.debug("chartHeifht:", chartHeight);
        let legendTranslateX = chartWidth / 2;
        console.debug("legendTranslateX:", legendTranslateX);
        let legendTranslateY = chartHeight / 6;
        console.debug("legendTranslateY:", legendTranslateY);
        let pieTranslateX = chartWidth / 2;
        let pieTranslateY = chartHeight / 2.4;
        console.debug("pieTranslateX:", pieTranslateX);
        console.debug("pieTransleteY:", pieTranslateY);

        switch (legendPosition) {
            case "left":
                legendTranslateX -= outerRadius;
                pieTranslateX += outerRadius;
                break;

            case "right":
                legendTranslateX += 20;
                pieTranslateX -= outerRadius;
                break;

            case "top":
                legendTranslateY -= outerRadius;
                pieTranslateY += outerRadius;
                break;

            case "bottom":
                legendTranslateY += outerRadius;
                pieTranslateY -= outerRadius;
                break;
        }

        console.debug("legendTranslateX:", legendTranslateX);
        console.debug("pieTranslateX:", pieTranslateX);
        return (
            <ChartCore {...this.props}>
                <G transform={`translate(${pieTranslateX}, ${pieTranslateY})`}>
                    {pie(this.props.categoryPercents).map(
                        (value: any, index: number) => {
                            const currentAngle = arc
                                .startAngle(value.startAngle)
                                .endAngle(value.endAngle)
                                .padAngle(value.padAngle);
                            return (
                                <Path
                                    key={index}
                                    //@ts-ignore
                                    d={currentAngle()}
                                    fill={categoryColors[index]}
                                ></Path>
                            );
                        }
                    )}
                    {pie(this.props.categoryPercents).map(
                        // @ts-ignore
                        (value: any, index: number) => {
                            return (
                                <Text
                                    key={index}
                                    dy={".4em"}
                                    textAnchor={"middle"}
                                    fontSize={percentLabelSize + "px"}
                                    fill={
                                        d3.hsl(categoryColors[index]).l >= 0.5
                                            ? this.props.percentLabelColorDark
                                            : this.props.percentLabelColorLight
                                    }
                                    transform={`translate(${arc
                                        .startAngle(value.startAngle)
                                        .endAngle(value.endAngle)
                                        .padAngle(value.padAngle)
                                        .centroid(value)})`}
                                >
                                    {value.data >= 5
                                        ? `${Math.round(value.data)}%`
                                        : ""}
                                </Text>
                            );
                        }
                    )}
                </G>
                <G
                    transform={`translate(${legendTranslateX}, ${legendTranslateY})`}
                >
                    {this.props.categoryLabels.map(
                        (value: string, index: number) => {
                            return (
                                <G
                                    key={index}
                                    transform={`translate(0, ${
                                        index * (categoryLabelPadding + 12)
                                    })`}
                                >
                                    <Rect
                                        key={index}
                                        width={categoryLabelPadding}
                                        height={categoryLabelPadding}
                                        rx={categoryLabelPadding}
                                        ry={categoryLabelPadding}
                                        fill={"transparent"}
                                        strokeWidth={2}
                                        stroke={categoryColors[index]}
                                    ></Rect>
                                    <Text
                                        x={categoryLabelPadding + 12}
                                        y={categoryLabelPadding / 2 + 6}
                                        fill={categoryLabelColor}
                                        fontSize={this.props.categoryLabelSize}
                                    >
                                        {value}
                                    </Text>
                                </G>
                            );
                        }
                    )}
                </G>
            </ChartCore>
        );
    }
    //buildChart(): void {

    //super.buildChart();

    //this.pieGroup = this.svg!.append("g");

    //this.legendCategoryGroups = this.legendGroup
    //.selectAll(".legend-category")
    //.data(this.props.categoryLabels!)
    //.enter()
    //.append("g")
    //.attr("class", "legend-category")
    //.attr(
    //"transform",
    //(_d, i) => `translate(0, ${i * (categoryLabelPadding + 12)})`
    //);

    ////const legendGroupBBox = this.legendGroup.node().getBBox();

    //}

    /*
        if (transitionIntro){

            slices = slices.transition()
                .duration(transitionIntro)
                .attrTween('d', (d) => {
                    const interpolate = d3Interpolate({startAngle: 0, endAngle: 0}, d);
                    return (t) => this.arc(interpolate(t));
                });
        }
        */

    //if (transition) {
    //slices = slices
    //.transition()
    //.duration(transition)
    //.attrTween("d", this._arcTransition as any) as any;
    //} else {
    //slices.attr("d", this.arc as any);
    //}

    /*
        if (transitionIntro){

            percents = percents.transition()
                .duration(transitionIntro);
        }
        */

    //if (transition) {
    //percents = percents.transition().duration(transition) as any;
    //}

    //_arcTransition = (a: any): ((a: any) => string | null) => {
    //const interpolateAngle = d3.interpolate(this.currentAngle, a);

    //this.currentAngle = interpolateAngle(0);

    //return (t: number): string | null => this.arc!(interpolateAngle(t));
    //};
}
