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
                // @ts-ignore
                (d, i) => `translate(0, ${i * (categoryLabelPadding + 12)})`
            );

        this.legendCategoryGroups
            .append("rect")
            .attr("width", categoryLabelPadding)
            .attr("height", categoryLabelPadding)
            .attr("rx", categoryLabelPadding)
            .attr("ry", categoryLabelPadding)
            .style("fill", "transparent")
            .style("stroke-width", 2)
            // @ts-ignore
            .style("stroke", (d, i) => categoryColors[i]);

        // @ts-ignore
        this.legendCategoryGroups
            .append("text")
            .attr("class", "legend-label")
            .attr("x", categoryLabelPadding + 12)
            .attr("y", categoryLabelPadding / 2 + 6)
            .text((d) => d)
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

        // @ts-ignore
        this.legendCategoryGroups!.select(".legend-label")
            .data(categoryLabels)
            .text((d) => d);

        let slices = this.pieGroup!.selectAll("path").data(
            // @ts-ignore
            this.pie!(categoryPercents)
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
            //@ts-ignore
            .attr("d", this.arc)
            //@ts-ignore
            .each((d) => (this.currentAngle = d))
            .merge(slices)
            // @ts-ignore
            .attr("fill", (d: any, i: number) => categoryColors[i]);

        if (transition) {
            // @ts-ignore
            slices = slices
                .transition()
                .duration(transition)
                // @ts-ignore
                .attrTween("d", this._arcTransition);
        } else {
            // @ts-ignore
            slices.attr("d", this.arc);
        }

        let percents = this.pieGroup!.selectAll("text")
            // @ts-ignore
            .data(this.pie(categoryPercents));

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
            .merge(percents)
            // @ts-ignore
            .style("fill", (d, i) => {
                return d3.hsl(categoryColors[i]).l >= 0.5
                    ? percentLabelColorDark
                    : percentLabelColorLight;
            })
            // @ts-ignore
            .text((d) => (d.data >= 5 ? `${Math.round(d.data)}%` : ""));

        if (transition) {
            // @ts-ignore
            percents = percents.transition().duration(transition);
        }
        percents.attr(
            "transform",
            // @ts-ignore
            (d: d3.DefaultArcObject) => `translate(${this.arc!.centroid(d)})`
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
