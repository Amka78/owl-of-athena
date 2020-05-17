import PropTypes from "prop-types";
import Chart, { ChartProps } from "./Chart";

export type ChartMovementProps = ChartProps & { movementTickColor?: string };
export default class ChartMovement extends Chart<ChartMovementProps> {
    private horizontalDividerTop?: d3.Selection<any, unknown, null, undefined>;
    private horizontalDividerBottom?: d3.Selection<
        any,
        unknown,
        null,
        undefined
    >;
    buildChart(): void {
        super.buildChart();

        this.graphGroup!.attr("clip-path", "url(#clip-path)");
    }

    updateChart(): void {
        super.updateChart();

        const { movementTickColor } = this.props;

        const chartHeight = this.getChartHeight();

        const movement = this.getData("movement");

        const movements = this.graphGroup!.selectAll(".movement-tick").data(
            movement
        );

        const movementTickSize = chartHeight / 8;

        movements
            .enter()
            .append("line")
            .attr("class", "movement-tick")
            //.style('opacity', 0)
            .attr("stroke", movementTickColor!)
            // @ts-ignore
            .merge(movements)
            //.transition(transition)
            .attr("x1", (d: any) => this.scaleX!(d.eventAt))
            .attr("y1", (d: any) =>
                this.scaleY!(-Math.floor(d.flags + 0.25) * movementTickSize)
            )
            .attr("x2", (d: any) => this.scaleX!(d.eventAt))
            .attr("y2", (d: any) =>
                this.scaleY!(Math.floor(d.flags + 0.25) * movementTickSize)
            );
        //.style('opacity', 1);

        movements
            .exit()
            //.transition(transition)
            //.style('opacity', 0)
            .remove();
    }

    buildAxes(): void {
        super.buildAxes();

        const chartHeight = this.getChartHeight();

        // @ts-ignore
        this.axisX!.tickFormat("").tickSizeOuter(1).tickSizeInner(-chartHeight);

        // @ts-ignore
        this.axisY!.tickFormat("").tickSize(0);

        this.axisGroupY!.append("text")
            .text("Movement")
            .attr("x", 0)
            .attr("y", chartHeight / 2);

        this.horizontalDividerTop = this.svg!.append("line");
        this.horizontalDividerBottom = this.svg!.append("line");
    }

    updateAxes(): void {
        super.updateAxes();

        const { axisXColor } = this.props;

        const chartWidth = this.getChartWidth();
        const chartHeight = this.getChartHeight();

        this.horizontalDividerTop!.attr("stroke", axisXColor!)
            .attr("x1", 0)
            .attr("x2", chartWidth)
            .attr("y1", 0)
            .attr("y2", 0);

        this.horizontalDividerBottom!.attr("stroke", axisXColor!)
            .attr("x1", 0)
            .attr("x2", chartWidth)
            .attr("y1", chartHeight)
            .attr("y2", chartHeight);
    }

    updateScales(): void {
        super.updateScales();

        const chartCenter = this.getChartHeight() / 2;

        this.scaleY!.domain([-chartCenter, chartCenter]);
    }

    static propTypes = {
        ...Chart.propTypes,
        movement: PropTypes.array.isRequired,
        movementTickSize: PropTypes.number.isRequired,
    };

    static defaultProps = {
        ...Chart.defaultProps,
        axisYLabelSize: 15,
        axisYLabelPadding: 24,
        axisMargin: { top: 0, right: 32, bottom: 0, left: 100 },
        movementTickSize: 10,
        movementTickColor: "#ff8260",
    };
}
