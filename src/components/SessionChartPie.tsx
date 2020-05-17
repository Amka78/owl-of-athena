import React, { FunctionComponent } from "react";
import { ChartPie } from "./charts";
import { Colors, Message, MessageKeys } from "../constants";
import { AuroraSession } from "../sdk/models";

export type SessionChartPieProps = {
    categoryLabelSize: number;
    categoryLabelPadding: number;
    width: number;
    height: number;
    transition?: number;
    percentLabelSize: number;
    outerRadius?: number;
    innerRadius?: number;
    session: AuroraSession;
};
type Duration = {
    hours: number;
    minutes: number;
};
const stages = [
    {
        label: MessageKeys.session_light_pie_chart_label,
        key: "lightDuration",
        color: Colors.teal,
    },
    {
        label: MessageKeys.session_deep_pie_chart_label,
        key: "deepDuration",
        color: Colors.purple,
    },
    {
        label: MessageKeys.session_rem_pie_chart_label,
        key: "remDuration",
        color: Colors.light_orange,
    },
    {
        label: MessageKeys.session_awake_pie_chart_label,
        key: "awakeDuration",
        color: Colors.yellow,
    },
    {
        label: MessageKeys.session_no_signal_pie_chart_label,
        key: "noSignalDuration",
        color: Colors.black,
    },
];
export const SessionChartPie: FunctionComponent<SessionChartPieProps> = (
    props: SessionChartPieProps
) => {
    const totalSleepTime = stages.reduce(
        (totalDuration, stage) => totalDuration + props.session[stage.key],
        0
    );
    return (
        // @ts-ignore
        <ChartPie
            width={props.width}
            height={props.height}
            percentLabelSize={props.percentLabelSize}
            categoryLabelSize={props.categoryLabelSize}
            categoryLabelPadding={props.categoryLabelPadding}
            outerRadius={props.outerRadius}
            innerRadius={props.innerRadius}
            categoryLabels={stages.map((stage) => {
                const duration = getDuration(props.session[stage.key]);
                return Message.get(stage.label, [
                    `${duration.hours > 0 ? duration.hours + "h" : ""} ${
                        duration.minutes
                    }m`,
                ]);
            })}
            categoryColors={stages.map((stage) => stage.color)}
            categoryPercents={stages.map(
                (stage) => (props.session[stage.key] / totalSleepTime) * 100
            )}
        />
    );
};

const getDuration = (ms: number): Duration => {
    const minutes = Math.ceil((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return { hours, minutes };
};
