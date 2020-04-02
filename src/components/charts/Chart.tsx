import React from "react";
import sortBy from "lodash/sortBy";
import * as d3 from "d3";
import PropTypes from "prop-types";
import { ViewStyle } from "react-native";

export type Margin = {
    left: number;
    right: number;
    top: number;
    bottom: number;
};

export type ChartProps = {
    containerStyle: ViewStyle;
    margin: Margin;
    transition: number;
    clipToRange: number;
    title: string;
    titleSize: number;
    titleColor: string;
    axisMargin: Margin;
    axisXEnabled: boolean;
    axisYEnabled: boolean;
    axisXColor: string;
    axisXLabelSize: number;
    axisXLabelColor: string;
    axisXLabelPadding: number;
    axisYLabelSize: number;
    axisYColor: string;
    axisYLabelColor: string;
    axisYLabelPadding: number;
    scaleXDomain: (number | Date | { valueOf(): number })[];
    scaleYDomain: (number | Date | { valueOf(): number })[];
    data?: any;
    dataBins: number[];
    dataBinThreshold: number;
    width: number | string;
    height: number | string;
    zoomX: number;
    zoomY: number;
};

export default class Chart<T extends ChartProps> extends React.Component<T> {
    protected svg?: d3.Selection<any, unknown, null, undefined>;
    protected scaleX?: d3.ScaleTime<number, number>;
    protected scaleY?: d3.ScaleTime<number, number>;
    protected axisX?: d3.Axis<number | Date | { valueOf(): number }>;
    protected lines?: d3.Line<[number, number]>[];
    protected axisGroupX?: d3.Selection<any, unknown, null, undefined>;
    protected axisY?: d3.Axis<number | Date | { valueOf(): number }>;
    protected axisGroupY?: d3.Selection<any, unknown, null, undefined>;
    protected graphGroup?: d3.Selection<any, unknown, null, undefined>;
    protected brushGroup?: d3.Selection<any, unknown, null, undefined>;
    private svgRef: any;
    private title?: d3.Selection<any, unknown, null, undefined>;
    private clipPath?: d3.Selection<any, unknown, null, undefined>;
    private clipPathId?: string;
    private transition?: d3.Transition<HTMLElement, unknown, null, undefined>;
    private zoom?: d3.ZoomBehavior<Element, unknown>;
    private brush?: d3.BrushBehavior<unknown>;
    private k?: number;
    constructor(props: T) {
        super(props);
    }
    public componentDidMount(): void {
        this.svg = d3.select(this.svgRef);

        this.buildChart();

        this.updateChart();

        this.zoomReset();
    }

    public componentDidUpdate(): void {
        this.updateChart();
    }

    public render(): JSX.Element {
        const style = Object.assign(
            {},
            {
                marginLeft: this.props.margin.left,
                marginRight: this.props.margin.right,
                marginTop: this.props.margin.top,
                marginBottom: this.props.margin.bottom
            },
            this.props.containerStyle
        );

        return (
            <svg
                ref={(ref: any): void => {
                    this.svgRef = ref;
                }}
                width={this.getChartWidth()}
                height={this.getChartHeight()}
                style={style}
            >
                {this.props.children}
            </svg>
        );
    }

    buildChart(): void {
        const { transition, clipToRange } = this.props;

        this.buildScales();
        this.buildAxes();

        this.title = this.svg!.append("text").attr("text-anchor", "middle");

        this.graphGroup = this.svg!.append("g");

        if (clipToRange) {
            this.clipPathId =
                "clip-path-" + Math.floor(Math.random() * 1000 + 1);
            this.clipPath = this.svg!.append("clipPath")
                .attr("id", this.clipPathId)
                .append("rect");

            this.graphGroup.attr("clip-path", `url(#${this.clipPathId})`);
        }

        if (transition) {
            this.transition = d3
                .transition()
                .duration(transition)
                .delay(10);
        }
    }

    updateChart(): void {
        const {
            title,
            margin,
            titleSize,
            titleColor,
            clipToRange
        } = this.props;

        const chartRangeX = this.getChartRangeX();
        const chartRangeY = this.getChartRangeY();

        this.updateScales();
        this.updateAxes();

        if (clipToRange) {
            this.clipPath!.attr("x", chartRangeX[0])
                .attr("y", chartRangeY[1])
                .attr("width", chartRangeX[1] - chartRangeX[0])
                .attr("height", chartRangeY[0] - chartRangeY[1]);
        }

        this.title!.attr("x", this.getChartWidth() / 2)
            .attr("y", margin.top)
            .attr("font-size", titleSize)
            .attr("fill", titleColor)
            .text(title);
    }

    enableZoom(): void {
        this.zoom = d3
            .zoom()
            .translateExtent([
                [0, 0],
                [this.getChartWidth(), this.getChartHeight()]
            ])
            .scaleExtent([0.5, 4])
            .on("zoom", this.onZoom.bind(this));

        this.svg!.call(this.zoom);
    }

    enableBrush(extentX: number, extentY: number): void {
        this.brush = d3.brushX();

        const extentStart = [this.props.axisMargin.left, 0];
        const extentStop = [
            this.getChartWidth() - this.props.axisMargin.right,
            this.getChartHeight() - this.props.axisMargin.bottom
        ];

        if (Array.isArray(extentX)) {
            extentStart[0] = extentX[0];
            extentStop[0] = extentX[1];
        }

        if (Array.isArray(extentY)) {
            extentStart[1] = extentY[0];
            extentStop[1] = extentY[1];
        }

        this.brush
            // @ts-ignore
            .extent([extentStart, extentStop])
            .on("end", this.onBrushEnd.bind(this));

        this.brushGroup = this.svg!.append("g").call(this.brush);
    }

    zoomReset(): void {
        this.k = 1;

        if (this.zoom) {
            this.svg!.transition()
                .duration(750)
                .call(this.zoom.transform, d3.zoomIdentity);
        }
    }

    buildScales(
        xScale?: d3.ScaleTime<number, number>,
        yScale?: d3.ScaleTime<number, number>
    ): void {
        this.scaleX = (xScale ? xScale : d3.scaleTime()).range(
            this.getChartRangeX()
        );
        this.scaleY = (yScale ? yScale : d3.scaleLinear()).range(
            this.getChartRangeY()
        ) as d3.ScaleTime<number, number>;
    }

    buildAxes(
        xAxis?: d3.Axis<number | Date | { valueOf(): number }>,
        yAxis?: d3.Axis<number | Date | { valueOf(): number }>
    ): void {
        const { axisXEnabled, axisYEnabled } = this.props;

        if (axisXEnabled) {
            this.axisX = xAxis ? xAxis : d3.axisBottom(this.scaleX!);

            this.axisGroupX = this.svg!.append("g");
        }

        if (axisYEnabled) {
            this.axisY = yAxis ? yAxis : d3.axisLeft(this.scaleY!);

            this.axisGroupY = this.svg!.append("g");
        }
    }

    updateAxes(): void {
        const {
            axisMargin,
            axisXColor,
            axisXLabelSize,
            axisXLabelColor,
            axisXLabelPadding,
            axisYLabelSize,
            axisYColor,
            axisYLabelColor,
            axisYLabelPadding,
            axisXEnabled,
            axisYEnabled
        } = this.props;

        if (axisXEnabled) {
            this.axisGroupX!.call(this.axisX!);

            this.axisGroupX!.selectAll("line").attr("stroke", axisXColor);

            this.axisGroupX!.select("path").attr("stroke", axisXColor);

            this.axisGroupX!.attr(
                "transform",
                `translate(0,${this.getChartHeight() - axisMargin.bottom})`
            )
                .selectAll("text")
                .attr("font-size", axisXLabelSize)
                .attr("fill", axisXLabelColor)
                .attr("transform", `translate(0, ${axisXLabelPadding})`);
        }

        if (axisYEnabled) {
            this.axisGroupY!.call(this.axisY!);

            this.axisGroupY!.selectAll("line").attr("stroke", axisYColor);

            this.axisGroupY!.select("path").attr("stroke", axisYColor);

            this.axisGroupY!.attr(
                "transform",
                `translate(${axisMargin.left}, 0)`
            )
                .selectAll("text")
                .attr("dy", ".3em")
                .attr("font-size", axisYLabelSize)
                .attr("fill", axisYLabelColor)
                .attr("transform", `translate(-${axisYLabelPadding}, 0)`);
        }
    }

    updateScales(): void {
        const { scaleXDomain, scaleYDomain } = this.props;

        this.scaleX!.range(this.getChartRangeX()).nice();

        this.scaleY!.range(this.getChartRangeY()).nice();

        if (scaleXDomain.length == 2) {
            this.scaleX!.domain(scaleXDomain);
        }

        if (scaleYDomain.length == 2) {
            this.scaleY!.domain(scaleYDomain);
        }
    }

    getData(prop = "data"): any[] {
        // @ts-ignore
        const data = this.props[prop];

        const bin = this.getCurrentBin();

        if (!bin) return data;

        const filteredData = [];

        for (const datum of data) {
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
    }

    getCurrentBin(): number {
        const { scaleXDomain, dataBins, dataBinThreshold } = this.props;

        if (!dataBins.length) return 0;

        // @ts-ignore
        const minutesVisible = (scaleXDomain[1] - scaleXDomain[0]) / 1000 / 60;

        if (minutesVisible < dataBinThreshold) return 0;

        if (dataBins.length == 1) return dataBins[0];

        const bins = sortBy(dataBins);

        for (let i = 1; i < bins.length; i++) {
            if (minutesVisible / bins[i] < dataBinThreshold) {
                return bins[i - 1];
            }
        }

        return bins[bins.length - 1];
    }

    getChartWidth(): number {
        return (
            this.props.width - this.props.margin.left - this.props.margin.right
        );
    }

    getChartHeight(): number {
        return (
            this.props.height - this.props.margin.top - this.props.margin.bottom
        );
    }

    getChartRangeX(): number[] {
        return [
            this.props.axisMargin.left,
            this.getChartWidth() - this.props.axisMargin.right
        ];
    }

    getChartRangeY(): number[] {
        return [
            this.getChartHeight() - this.props.axisMargin.bottom,
            this.props.axisMargin.top
        ];
    }

    onZoom(): void {
        if (this.props.zoomX) {
            this.axisGroupX!.call(
                this.axisX!.scale(d3.event.transform.rescaleX(this.scaleX))
            );
        }

        if (this.props.zoomY) {
            this.axisGroupY!.call(
                this.axisY!.scale(d3.event.transform.rescaleY(this.scaleY))
            );
        }
    }

    onBrushEnd(): void {
        if (!d3.event.sourceEvent) return; // Only transition after input.
        if (!d3.event.selection) return; // Ignore empty selections.

        const domain = d3.event.selection.map(this.scaleX!.invert);
        const ticks = this.scaleX!.ticks(32);

        let leftTickIndex = d3.bisectLeft(ticks, domain[0]);
        let rightTickIndex = d3.bisectRight(ticks, domain[1]);

        if (this.scaleX!(domain[0]) != this.scaleX!(ticks[leftTickIndex])) {
            const selectionIndexSpan = rightTickIndex - leftTickIndex;
            leftTickIndex = Math.max(leftTickIndex - 1, 0);
            rightTickIndex = leftTickIndex + selectionIndexSpan;
        }

        const newSelection = [ticks[leftTickIndex], ticks[rightTickIndex]];

        this.brushGroup!.transition().call(
            this.brush!.move,
            newSelection.map(this.scaleX!)
        );
    }

    static propTypes = {
        height: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,

        margin: PropTypes.shape({
            top: PropTypes.number,
            bottom: PropTypes.number,
            left: PropTypes.number,
            right: PropTypes.number
        }),

        containerStyle: PropTypes.object,

        axisMargin: PropTypes.shape({
            top: PropTypes.number,
            bottom: PropTypes.number,
            left: PropTypes.number,
            right: PropTypes.number
        }),

        dataBins: PropTypes.arrayOf(PropTypes.number),
        dataBinThreshold: PropTypes.number,

        clipToRange: PropTypes.bool,

        title: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
        titleSize: PropTypes.number,
        titleColor: PropTypes.string,

        transition: PropTypes.number,

        zoomX: PropTypes.bool,
        zoomY: PropTypes.bool,

        scaleXDomain: PropTypes.arrayOf(PropTypes.number),
        scaleYDomain: PropTypes.arrayOf(PropTypes.number),

        axisXEnabled: PropTypes.bool,
        axisXColor: PropTypes.string,
        axisXLabelSize: PropTypes.number,
        axisXLabelColor: PropTypes.string,
        axisXLabelPadding: PropTypes.number,

        axisYenabled: PropTypes.bool,
        axisYColor: PropTypes.string,
        axisYLabelSize: PropTypes.number,
        axisYLabelColor: PropTypes.string,
        axisYLabelPadding: PropTypes.number
    };

    static defaultProps = {
        margin: { top: 32, right: 32, bottom: 32, left: 32 },
        axisMargin: { top: 32, right: 32, bottom: 32, left: 32 },

        containerStyle: {},

        dataBins: [],
        dataBinThreshold: 16,

        clipToRange: true,

        title: "",
        titleSize: 15,
        titleColor: "#eee",

        transition: 500,

        zoomX: false,
        zoomY: false,

        scaleXDomain: [],
        scaleYDomain: [],

        axisXEnabled: true,
        axisXColor: "#250d6d",
        axisXLabelSize: 12,
        axisXLabelColor: "#ccc",
        axisXLabelPadding: 4,

        axisYEnabled: true,
        axisYColor: "#250d6d",
        axisYLabelSize: 12,
        axisYLabelColor: "#ccc",
        axisYLabelPadding: 4
    };
}
