import React from "react";
import PropTypes from "prop-types";
import Chart, { ChartProps } from "./Chart";
import * as d3 from "d3";
import { Colors } from "../../constants";

export type ChartPieProps = ChartProps & {
    categoryColors: string[];
    categoryLabels: React.ReactNode[];
    categoryLabelSize: number;
    categoryLabelColor: string;
    categoryLabelPadding: number;
    legendPosition: string;
    outerRadius?: number;
    innerRadius?: number;
    categoryPercents: React.ReactNode[];
    percentLabelSize: number;
    percentLabelColorDark: string;
    percentLabelColorLight: string;
};
export default class ChartPie extends Chart<ChartPieProps> {
    private pie?: d3.Pie<any, number | { valueOf(): number }>;
    private arc?: d3.Arc<any, d3.DefaultArcObject>;
    private pieGroup?: d3.Selection<any, unknown, null, undefined>;
    private legendGroup?: d3.Selection<any, unknown, null, undefined>;
    private legendCategoryGroups?: d3.Selection<
        any,
        React.ReactNode,
        any,
        unknown
    >;
    private currentAngle?: number;
    buildChart(): void {
        super.buildChart();

        const {
            categoryColors,
            categoryLabelSize,
            categoryLabelColor,
            categoryLabelPadding,
            legendPosition,
        } = this.props;

        this.pie = d3.pie();

        this.pie.padAngle(0.03);

        const width = this.getChartWidth();
        const height = this.getChartHeight();

        const outerRadius = this.props.outerRadius
            ? this.props.outerRadius
            : width / 2;
        const innerRadius = this.props.innerRadius
            ? this.props.innerRadius
            : width / 3;

        this.arc = d3.arc();

        this.arc.outerRadius(outerRadius).innerRadius(innerRadius);

        this.pieGroup = this.svg!.append("g");
        this.legendGroup = this.svg!.append("g");

        this.legendGroup.attr("class", "legend");

        this.legendCategoryGroups = this.legendGroup
            .selectAll(".legend-category")
            .data(this.props.categoryLabels!)
            .enter()
            .append("g")
            .attr("class", "legend-category")
            .attr(
                "transform",
                (_d, i) => `translate(0, ${i * (categoryLabelPadding + 12)})`
            );

        this.legendCategoryGroups
            .append("rect")
            .attr("width", categoryLabelPadding)
            .attr("height", categoryLabelPadding)
            .attr("rx", categoryLabelPadding)
            .attr("ry", categoryLabelPadding)
            .style("fill", "transparent")
            .style("stroke-width", 2)
            .style("stroke", (_d, i) => categoryColors[i]);

        this.legendCategoryGroups
            .append("text")
            .attr("class", "legend-label")
            .attr("x", categoryLabelPadding + 12)
            .attr("y", categoryLabelPadding / 2 + 6)
            .text((d) => d as any)
            .style("fill", categoryLabelColor)
            .style("font-size", categoryLabelSize);

        const legendGroupBBox = this.legendGroup.node().getBBox();

        let legendTranslateX = width / 2 - legendGroupBBox.width / 2;
        let legendTranslateY = height / 2 - legendGroupBBox.height / 2;
        let pieTranslateX = width / 2;
        let pieTranslateY = height / 2;

        switch (legendPosition) {
            case "left":
                legendTranslateX -= outerRadius;
                pieTranslateX += outerRadius;
                break;

            case "right":
                legendTranslateX += outerRadius;
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

        this.pieGroup.attr(
            "transform",
            `translate(${pieTranslateX}, ${pieTranslateY})`
        );
        this.legendGroup.attr(
            "transform",
            `translate(${legendTranslateX},${legendTranslateY})`
        );
    }

    updateChart(): void {
        super.updateChart();

        const {
            categoryColors,
            categoryLabels,
            categoryPercents,
            percentLabelSize,
            percentLabelColorDark,
            percentLabelColorLight,
            transition,
            legendPosition,
        } = this.props;

        this.legendCategoryGroups!.select(".legend-label")
            .data(categoryLabels)
            .text((d) => d as any);

        let slices = this.pieGroup!.selectAll("path").data(
            this.pie!(categoryPercents as any)
        );

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

        slices = slices
            .enter()
            .append("path")
            .attr("d", this.arc as any)
            .each((d) => (this.currentAngle = d as any))
            .merge(slices as any)
            .attr("fill", (_d: any, i: number) => categoryColors[i]) as any;

        if (transition) {
            slices = slices
                .transition()
                .duration(transition)
                .attrTween("d", this._arcTransition as any) as any;
        } else {
            slices.attr("d", this.arc as any);
        }

        let percents = this.pieGroup!.selectAll("text").data(
            this.pie!(categoryPercents as any)
        );

        /*
        if (transitionIntro){

            percents = percents.transition()
                .duration(transitionIntro);
        }
        */

        percents = percents
            .enter()
            .append("text")
            .attr("dy", ".4em")
            .attr("text-anchor", "middle")
            .style("font-size", percentLabelSize + "px")
            .merge(percents as any)
            .style("fill", (_d, i) => {
                return d3.hsl(categoryColors[i]).l >= 0.5
                    ? percentLabelColorDark
                    : percentLabelColorLight;
            })
            .text((d) =>
                d.data >= 5 ? `${Math.round(d.data as any)}%` : ""
            ) as any;

        if (transition) {
            percents = percents.transition().duration(transition) as any;
        }
        percents.attr(
            "transform",
            (d) => `translate(${this.arc!.centroid(d as any)})`
        );

        //copied here because I'm lazy
        const width = this.getChartWidth();
        const height = this.getChartHeight();
        const legendGroupBBox = this.legendGroup!.node().getBBox();

        const outerRadius = this.props.outerRadius
            ? this.props.outerRadius
            : width / 2;

        let legendTranslateX = width / 2 - legendGroupBBox.width / 2;
        let legendTranslateY = height / 2 - legendGroupBBox.height / 2;
        let pieTranslateX = width / 2;
        let pieTranslateY = height / 2;

        switch (legendPosition) {
            case "left":
                legendTranslateX -= outerRadius;
                pieTranslateX += outerRadius;
                break;

            case "right":
                legendTranslateX += outerRadius;
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

        this.pieGroup!.attr(
            "transform",
            `translate(${pieTranslateX}, ${pieTranslateY})`
        );
        this.legendGroup!.attr(
            "transform",
            `translate(${legendTranslateX},${legendTranslateY})`
        );
    }

    _arcTransition = (a: any): ((a: any) => string | null) => {
        const interpolateAngle = d3.interpolate(this.currentAngle, a);

        this.currentAngle = interpolateAngle(0);

        return (t: number): string | null => this.arc!(interpolateAngle(t));
    };

    static propTypes = {
        ...Chart.propTypes,
        categoryLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
        categoryPercents: PropTypes.arrayOf(PropTypes.number).isRequired,
        categoryColors: PropTypes.arrayOf(PropTypes.string),
        innerRadius: PropTypes.number,
        outerRadius: PropTypes.number,
        transitionIntro: PropTypes.number,
        legendPosition: PropTypes.oneOf([
            "left",
            "right",
            "top",
            "bottom",
            "center",
        ]),
    };

    static defaultProps = {
        ...Chart.defaultProps,
        axisYEnabled: false,
        axisXEnabled: false,

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
    };
}
