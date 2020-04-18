// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import Chart, { ChartProps } from "./Chart";
import * as d3 from "d3";
import { Colors } from "../../constants";

export type ChartRadialProgressProps = ChartProps & {
    startAngle: number;
    bgColor: string;
    fgColor: string;
    valueLabelColor: string;
    valueLabelSize: number;
    outerRadius: number;
    innerRadius: number;
    value: number;
    minValue: number;
    maxValue: number;
    valueLabel: string;
};

export default class ChartRadialProgress extends Chart<
    ChartRadialProgressProps
> {
    private arc?: d3.Arc<any, d3.DefaultArcObject>;
    private arcBg?: d3.Selection<any, unknown, null, undefined>;
    private arcFg?: d3.Selection<any, unknown, null, undefined>;
    private label?: d3.Selection<any, unknown, null, undefined>;
    buildChart(): void {
        super.buildChart();

        const {
            width,
            startAngle,
            bgColor,
            fgColor,
            valueLabelColor,
            valueLabelSize,
        } = this.props;

        const outerRadius = this.props.outerRadius
            ? this.props.outerRadius
            : width / 2;
        const innerRadius = this.props.innerRadius
            ? this.props.innerRadius
            : outerRadius - 2;

        this.arc = d3.arc();

        this.arc
            .startAngle(this.getRadiansFromDegrees(startAngle))
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        this.arcBg = this.graphGroup!.append("path");

        this.arcBg
            // @ts-ignore
            .attr("d", this.arc.endAngle(2 * Math.PI))
            .attr("transform", `translate(${outerRadius},${outerRadius})`)
            .attr("fill", bgColor);

        this.arcFg = this.graphGroup!.append("path");

        this.arcFg
            .attr("transform", `translate(${outerRadius},${outerRadius})`)
            .style("fill", fgColor);

        this.label = this.graphGroup!.append("text")
            .attr("x", outerRadius)
            .attr("y", outerRadius)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("fill", valueLabelColor)
            .style("font-size", valueLabelSize);

        this.updateChart();
    }

    updateChart(): void {
        super.updateChart();

        const {
            startAngle,
            value,
            minValue,
            maxValue,
            valueLabel,
        } = this.props;

        this.arcFg!.transition().attr(
            "d",
            // @ts-ignore
            this.arc!.endAngle(
                this.getRadiansFromProgress(
                    startAngle,
                    value,
                    minValue,
                    maxValue
                )
            )
        );

        this.label!.text(valueLabel);
    }

    getRadiansFromDegrees(angle: number): number {
        return (angle * Math.PI) / 180;
    }

    getRadiansFromProgress(
        startAngle: number,
        value: number,
        minValue: number,
        maxValue: number
    ): number {
        return (
            this.getRadiansFromDegrees(startAngle) +
            2 *
                Math.PI *
                Math.min(
                    maxValue,
                    Math.max(minValue, value / (maxValue - minValue))
                )
        );
    }

    static propTypes = {
        ...Chart.propTypes,

        labelText: PropTypes.string,
        labelStyle: PropTypes.object,

        value: PropTypes.number.isRequired,
        minValue: PropTypes.number.isRequired,
        maxValue: PropTypes.number.isRequired,

        innerRadius: PropTypes.number,
        outerRadius: PropTypes.number,

        startAngle: PropTypes.number,

        bgColor: PropTypes.string,
        fgColor: PropTypes.string,
    };

    static defaultProps = {
        ...Chart.defaultProps,

        axisYEnabled: false,
        axisXEnabled: false,

        margin: { top: 0, right: 0, bottom: 0, left: 0 },

        valueLabel: "",
        valueLabelColor: "#ffffff",
        valueLabelSize: 12,

        clipToRange: false,

        value: 0,
        minValue: 0,
        maxValue: 100,
        bgColor: "rgba(255,255,255,.5)",
        fgColor: Colors.teal,
        startAngle: 0,
    };
}
