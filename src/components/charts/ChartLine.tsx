import PropTypes from "prop-types";
import Chart, { ChartProps } from "./Chart";
import moment from "moment";
import * as d3 from "d3";

export default class ChartLine extends Chart<ChartProps> {
    public shouldComponentUpdate(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _nextProps: Readonly<ChartProps>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _nextState: Readonly<{}>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _nextContext: any
    ): boolean {
        return false;
    }
    buildGraph(): void {
        // @ts-ignore
        this.buildScales(d3.scaleLinear());

        this.scaleY!.domain([-2048, 2048]);

        this.scaleX!.domain([0, this.props.data[0].length * 128]);

        this.buildAxes();

        this.axisX!.tickFormat((d) =>
            // @ts-ignore
            moment(d).format("h:ma").slice(0, -1)
        );

        this.axisY!.ticks(16);

        this.updateGraph();
    }

    updateGraph(): void {
        // @ts-ignore
        this.lines = [];

        for (let i = 0; i < this.props.data.length; i++) {
            this.lines![i] = d3.line();

            this.lines[i]
                .x((_d, i) => this.scaleX!(i * 128))
                // @ts-ignore
                .y((d) => this.scaleY!(d));

            this.svg!.append("path")
                .datum(this.props.data[i])
                .filter((_d, i) => !(i % 64))
                .attr("class", "path")
                .attr("stroke", "steelblue")
                // @ts-ignore
                .attr("d", this.lines[i](this.props.data[i]));
        }
    }

    processData(): void {
        return;
    }

    static propTypes = {
        ...Chart.propTypes,
        data: PropTypes.arrayOf(PropTypes.array).isRequired,
    };

    static defaultProps = {
        ...Chart.defaultProps,
    };
}
