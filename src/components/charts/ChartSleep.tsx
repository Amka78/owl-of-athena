// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import Chart, { ChartProps } from "./Chart";
import moment from "moment";
import * as d3 from "d3";
import { AuroraEvent } from "../../sdk/models";
import { Colors } from "../../constants";
export type TickInterval = "hour" | "default";
export type ChartSleepProps = ChartProps & {
    tickInterval: TickInterval;
    sleep: Array<AuroraEvent>;
    totalSleepHour: number;
};

export default class ChartSleep extends Chart<ChartSleepProps> {
    static propTypes = {
        ...Chart.propTypes,
        sleep: PropTypes.array.isRequired,
    };

    static sleepStageLabels = ["", "Deep", "Light", "REM", "Awake"];
    static sleepStageColors = [
        Colors.blue,
        "#4a2fba",
        Colors.teal,
        "#ff8260",
        "#daf392",
    ];
    static sleepStageMapping = [0, 4, 2, 1, 3];

    private horizontalDividerBottom?: d3.Selection<
        any,
        unknown,
        null,
        undefined
    >;

    private horizontalDividerTop?: d3.Selection<any, unknown, null, undefined>;

    private gradientId?: string;

    private lineFunction?: d3.Line<[number, number]>;
    buildScales(): void {
        super.buildScales();

        this.scaleY!.domain([0, ChartSleep.sleepStageLabels.length - 1]);
    }

    buildAxes(): void {
        super.buildAxes();

        if (this.props.tickInterval === "default") {
            this.axisX!.tickFormat((d) =>
                // @ts-ignore
                moment(d).utc().format("h:mm a").replace(":00", "").slice(0, -1)
            ).tickSizeOuter(0);
        } else {
            this.axisX!.ticks(this.props.totalSleepHour)
                .tickFormat((d) =>
                    // @ts-ignore
                    moment(d).utc().format("h")
                )
                .tickSizeOuter(0);
        }

        // @ts-ignore
        this.axisY!.tickFormat((d) => ChartSleep.sleepStageLabels[d])
            .tickSize(0)
            .ticks(ChartSleep.sleepStageLabels.length - 1);

        this.horizontalDividerTop = this.svg!.append("line");
        this.horizontalDividerBottom = this.svg!.append("line");
    }

    buildChart(): void {
        super.buildChart();

        const sleepStageCount = ChartSleep.sleepStageLabels.length;

        this.gradientId = "gradient-" + Math.floor(Math.random() * 1000 + 1);

        const gradient = this.svg!.append("defs")
            .append("linearGradient")
            .attr("id", this.gradientId)
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("spreadMethod", "pad");

        for (let i = 0; i < sleepStageCount; i++) {
            gradient
                .append("stop")
                .attr("offset", (100 * i) / (sleepStageCount - 1) + "%")
                .attr(
                    "stop-color",
                    ChartSleep.sleepStageColors[sleepStageCount - i - 1]
                )
                .attr("stop-opacity", 1);
        }

        this.lineFunction = d3
            .line()
            .curve(d3.curveStepAfter)
            // @ts-ignore
            .x((d) => this.scaleX!(d.eventAt))
            // @ts-ignore
            .y((d) => this.scaleY!(ChartSleep.sleepStageMapping[d.flags]));
    }

    updateAxes(): void {
        super.updateAxes();

        const { axisXColor, axisMargin } = this.props;

        const chartWidth = this.getChartWidth();
        const chartHeight = this.getChartHeight();

        this.axisX!.tickSize(-chartHeight);

        this.axisGroupY!.selectAll("text").style(
            "fill",
            (_d, i) => ChartSleep.sleepStageColors[i]
        );

        this.horizontalDividerTop!.attr("stroke", axisXColor)
            .attr("x1", 0)
            .attr("x2", chartWidth)
            .attr("y1", 0)
            .attr("y2", 0);

        this.horizontalDividerBottom!.attr("stroke", axisXColor)
            .attr("x1", 0)
            .attr("x2", chartWidth)
            .attr("y1", chartHeight - axisMargin.bottom)
            .attr("y2", chartHeight - axisMargin.bottom);
    }

    updateChart(): void {
        super.updateChart();

        const scaleXDomain = this.props.scaleXDomain;

        const sleep = this.getData("sleep");

        //if we have an odd number of events
        //let's create an additional one at the end
        if (sleep.length) {
            sleep.unshift(
                Object.assign({}, sleep[0], {
                    time: 0,
                    eventAt: scaleXDomain[0],
                })
            );
            sleep.push(
                Object.assign({}, sleep[sleep.length - 1], {
                    eventAt: scaleXDomain[1],
                    // @ts-ignore
                    time: scaleXDomain[1] - scaleXDomain[0],
                })
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let sleepPath = this.graphGroup!.selectAll("path").data([sleep]);

        sleepPath = sleepPath
            .enter()
            .append("path")
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 2)
            .attr("stroke", `url(#${this.gradientId})`)
            .attr("fill", "none")
            .merge(sleepPath)
            // @ts-ignore
            .attr("d", this.lineFunction);
    }

    static defaultProps = {
        ...Chart.defaultProps,
        axisMargin: { top: 32, right: 32, bottom: 48, left: 100 },
        axisYLabelSize: 15,
        axisYLabelPadding: 24,
        axisXLabelSize: 15,
        axisXLabelPadding: 16,
    };
}
