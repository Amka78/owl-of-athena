import PropTypes from "prop-types";
import Chart, { ChartProps } from "./Chart";
import moment from "moment";
import * as d3 from "d3";
import * as d3Multi from "d3-selection-multi";

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
                    : moment(d as Date)
                          .utc()
                          .format("h:mm a")
                          .replace(":00", "")
                          .slice(0, -1)
            );
    }

    updateScales(): void {
        super.updateScales();

        const chartCenter = this.getChartHeight() / 2;

        this.scaleY!.domain([-chartCenter, chartCenter]);
    }

    updateAxes(): void {
        super.updateAxes();

        this.axisGroupX!.attr(
            "transform",
            `translate(0, ${this.getChartHeight() / 2})`
        );
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

        const eventTicks = this.graphGroup!.selectAll(".event-tick").data(
            events
        );

        const eventLabels = this.graphGroup!.selectAll(".event-label").data(
            events.filter((e) => typeof e.label != "undefined")
        );

        const eventIcons = this.graphGroup!.selectAll(".event-icon").data(
            events.filter((e) => typeof e.icon != "undefined")
        );

        eventTicks
            .enter()
            .append("line")
            .attr("class", "event-tick")
            .merge(eventTicks as any)
            .attr("stroke", (d) => d.tickColor || eventTickColor)
            .attr("stroke-width", (d) => d.tickWidth || eventTickWidth)
            .styles(this.props.eventTickStyle)
            .attrs(this.getEventTickPositionProps);

        eventTicks.exit().remove();

        eventLabels
            .enter()
            .append("text")
            .attr("class", "event-label")
            .merge(eventLabels as any)
            .attr("fill", (d) => d.labelColor || eventLabelColor)
            .attr("font-size", (d) => d.labelSize || eventLabelSize)
            .styles(this.props.eventLabelStyle)
            .text((d) => {
                return d.label
                    .replace(
                        "${time}",
                        moment(d.date).utc().format("h:mm a").slice(0, -1)
                    )
                    .replace("${flags}", d.flags > 1 ? d.flags : "");
            })
            .attrs(this.getEventLabelPositionProps);

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
            .styles(this.props.eventIconStyle)
            .attrs(this.getEventIconPositionProps);

        eventIcons.exit().remove();
    }

    private getEventIconPositionProps = (d: any): { x: number; y: number } => {
        const { eventIconSize, eventTickSize, eventPlacement } = this.props;

        const iconSize = d.iconSize || eventIconSize;
        const tickSize = d.tickSize || eventTickSize;
        const placement = d.placement || eventPlacement;

        const props = {
            // @ts-ignore
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
        d: any
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
            // @ts-ignore
            props.y1 = this.scaleY!(0);
            // @ts-ignore
            props.y2 = this.scaleY!(-tickSize);
        } else {
            // @ts-ignore
            props.y1 = this.scaleY!(-1);
            // @ts-ignore
            props.y2 = this.scaleY!(tickSize);
        }

        // @ts-ignore
        return props;
    };

    private getEventLabelPositionProps = (d: any): any => {
        const {
            eventPlacement,
            eventIconSize,
            eventLabelPosition,
            eventTickSize,
        } = this.props;

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
                // @ts-ignore
                props.x +=
                    (iconSize / 2 + 10) * (labelPosition == "left" ? -1 : 1);
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

    static propTypes = {
        ...Chart.propTypes,

        events: PropTypes.array,

        eventPlacement: PropTypes.oneOf(["above", "below"]),

        eventTickStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
        eventTickWidth: PropTypes.number,
        eventTickColor: PropTypes.string,
        eventTickSize: PropTypes.number,

        eventLabelStyle: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.func,
        ]),
        eventLabelPosition: PropTypes.oneOf(["left", "center", "right"]),
        eventLabelColor: PropTypes.string,
        eventLabelSize: PropTypes.number,

        eventIconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
        eventIconColor: PropTypes.string,
        eventIconSize: PropTypes.number,
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
