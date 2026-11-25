import * as d3 from "d3";
import "d3-selection-multi";
import type * as d3Multi from "d3-selection-multi";
import dayjs from "../../utils/dayjs";
import Chart, { type ChartProps } from "./Chart";

// d3-selection-multi の .styles/.attrs は prototype パッチ依存で、browser の
// モジュール解決（pre-bundle）では効かないことがある。d3 標準 API で等価実装する。
const applyStyles = (selection: any, styles: Record<string, unknown> | undefined | null): any => {
    if (styles) {
        for (const [name, value] of Object.entries(styles)) {
            selection.style(name, value);
        }
    }
    return selection;
};

const applyAttrs = (
    selection: any,
    attrs: Record<string, unknown> | ((d: any, i: number) => Record<string, unknown>),
): any => {
    if (!attrs) return selection;
    selection.each(function (this: any, d: any, i: number) {
        const resolved = typeof attrs === "function" ? attrs(d, i) : attrs;
        if (resolved) {
            for (const [name, value] of Object.entries(resolved)) {
                selection.attr(name, value);
            }
        }
    });
    return selection;
};

export type ChartTimeLineProps = ChartProps & {
    eventIconSize: number;
    eventIconColor: string;
    eventLabelColor: string;
    eventLabelSize: number;
    eventLabelStyle: d3Multi.ValueMap<any, any>;
    eventLabelPosition: number;
    eventTickColor: string;
    eventTickWidth: number;
    eventTickSize: number;
    eventPlacement: number;
    eventTickStyle: d3Multi.ValueMap<any, any>;
    eventIconStyle: d3Multi.ValueMap<any, any>;
};
export default class ChartTimeline extends Chart<ChartTimeLineProps> {
    buildAxes(): void {
        super.buildAxes(d3.axisTop(this.scaleX!));

        this.axisX!.ticks(24)
            .tickSizeOuter(0)
            .tickFormat((d, i) =>
                !i || i % 6
                    ? ""
                    : dayjs(d as Date)
                          .utc()
                          .format("h:mm a")
                          .replace(":00", "")
                          .slice(0, -1),
            );
    }

    updateScales(): void {
        super.updateScales();

        const chartCenter = this.getChartHeight() / 2;

        this.scaleY!.domain([-chartCenter, chartCenter]);
    }

    updateAxes(): void {
        super.updateAxes();

        this.axisGroupX!.attr("transform", `translate(0, ${this.getChartHeight() / 2})`);
    }

    buildChart(): void {
        super.buildChart();

        const chartCenter = this.getChartHeight() / 2;

        this.enableBrush(null as any, [chartCenter - 25, chartCenter] as any);

        this.brushGroup!.select(".selection").attr("stroke", "none");
    }

    updateChart(): void {
        super.updateChart();

        const {
            eventIconSize,
            eventIconColor,
            eventLabelColor,
            eventLabelSize,
            eventTickColor,
            eventTickWidth,
        } = this.props;

        const events = this.getData("events");

        if (!events.length) {
            return;
        }

        const eventTicks = this.graphGroup!.selectAll(".event-tick").data(events);

        const eventLabels = this.graphGroup!.selectAll(".event-label").data(
            events.filter((e) => typeof e.label != "undefined"),
        );

        const eventIcons = this.graphGroup!.selectAll(".event-icon").data(
            events.filter((e) => typeof e.icon != "undefined"),
        );

        eventTicks
            .enter()
            .append("line")
            .attr("class", "event-tick")
            .merge(eventTicks as any)
            .attr("stroke", (d) => d.tickColor || eventTickColor)
            .attr("stroke-width", (d) => d.tickWidth || eventTickWidth)
            .call((sel: any) => {
                applyStyles(sel, this.props.eventTickStyle);
                applyAttrs(sel, this.getEventTickPositionProps);
            });

        eventTicks.exit().remove();

        eventLabels
            .enter()
            .append("text")
            .attr("class", "event-label")
            .merge(eventLabels as any)
            .attr("fill", (d) => d.labelColor || eventLabelColor)
            .attr("font-size", (d) => d.labelSize || eventLabelSize)
            .text((d: any) => {
                return d.label
                    .replace("${time}", dayjs(d.date).utc().format("h:mm a").slice(0, -1))
                    .replace("${flags}", d.flags > 1 ? d.flags : "");
            })
            .call((sel: any) => {
                applyStyles(sel, this.props.eventLabelStyle);
                applyAttrs(sel, this.getEventLabelPositionProps);
            });

        eventLabels.exit().remove();

        eventIcons
            .enter()
            .append("use")
            .attr("class", "event-icon")
            .merge(eventIcons as any)
            .attr("width", (d) => d.iconSize || eventIconSize)
            .attr("height", (d) => d.iconSize || eventIconSize)
            .attr("fill", (d) => d.iconColor || eventIconColor)
            .attr("href", (d) => `#${d.icon}`)
            .call((sel: any) => {
                applyStyles(sel, this.props.eventIconStyle);
                applyAttrs(sel, this.getEventIconPositionProps);
            });

        eventIcons.exit().remove();
    }

    private getEventIconPositionProps = (d: any): { x: number; y: number } => {
        const { eventIconSize, eventTickSize, eventPlacement } = this.props;

        const iconSize = d.iconSize || eventIconSize;
        const tickSize = d.tickSize || eventTickSize;
        const placement = d.placement || eventPlacement;

        const props = {
            x: this.scaleX!(d.date) - iconSize / 2,
            y: 0,
        };

        props.y =
            placement == "below"
                ? // @ts-ignore
                  this.scaleY!(-tickSize) + 4
                : // @ts-ignore
                  this.scaleY!(tickSize) - iconSize - 4;

        return props;
    };

    private getEventTickPositionProps = (
        d: any,
    ): { x1: number; y1: number; x2: number; y2: number } => {
        const { eventTickSize, eventPlacement } = this.props;

        const tickSize = d.tickSize || eventTickSize;
        const placement = d.placement || eventPlacement;

        const x = this.scaleX!(d.date);

        const props = {
            x1: x,
            x2: x,
            y1: 0,
            y2: 0,
        };

        if (placement == "below") {
            props.y1 = this.scaleY!(0);
            props.y2 = this.scaleY!(-tickSize);
        } else {
            props.y1 = this.scaleY!(-1);
            props.y2 = this.scaleY!(tickSize);
        }

        return props;
    };

    private getEventLabelPositionProps = (d: any): any => {
        const { eventPlacement, eventIconSize, eventLabelPosition, eventTickSize } = this.props;

        const iconSize = d.iconSize || eventIconSize;
        const tickSize = d.tickSize || eventTickSize;
        const placement = d.placement || eventPlacement;
        const labelPosition = d.labelPosition || eventLabelPosition;

        const props = {
            "text-anchor": ChartTimeline.labelPositions[labelPosition],
            x: this.scaleX!(d.date),
            y: tickSize,
        };

        if (d.icon) {
            if (labelPosition != "center") {
                props.x += (iconSize / 2 + 10) * (labelPosition == "left" ? -1 : 1);
                props.y += iconSize / 2;
            } else {
                props.y += iconSize * 2;
            }
        }

        if (placement == "below") {
            props.y = -props.y;
        }

        props.y = this.scaleY!(props.y);

        return props;
    };

    static defaultProps = {
        ...Chart.defaultProps,

        axisYEnabled: false,
        axisXLabelPadding: 0,

        clipToRange: false,

        eventPlacement: "above",

        eventTickStyle: {},
        eventTickWidth: 1,
        eventTickColor: "#ccc",
        eventTickSize: 56,

        eventLabelStyle: {},
        eventLabelPosition: "center",
        eventLabelColor: "#ccc",
        eventLabelSize: 12,

        eventIconStyle: {},
        eventIconColor: "#fff",
        eventIconSize: 36,
    };

    static labelPositions: { [stringIndex: string]: any } = {
        left: "end",
        center: "middle",
        right: "start",
    };
}
