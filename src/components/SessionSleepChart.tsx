import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { ChartSleep, ChartMovement } from "../components/charts";
import { AuroraSessionDetail } from "../sdk/models/AuroraSessionDetail";
import { Layout } from "../constants";

export type SessionSleepChartProps = {
    width: number;
    height: number;
    scaleXDomain: (number | Date | { valueOf(): number })[];
    isFilterEnabled: boolean;
    sessionDetail: AuroraSessionDetail;
    totalSleepHour: number;
};
export const SessionSleepChart: FunctionComponent<SessionSleepChartProps> = (
    props: SessionSleepChartProps
) => {
    const {
        width,
        height,
        scaleXDomain,
        isFilterEnabled,
        sessionDetail,
    } = props;
    const chartSleepHeight = height - 100;
    const chartMovementHeight = height - chartSleepHeight;
    const { sleepEvents, movementEvents } = sessionDetail;

    const chartSleep =
        sleepEvents.length > 0 ? (
            <ChartSleep
                width={width}
                height={chartSleepHeight}
                sleep={sleepEvents.slice()}
                dataBins={isFilterEnabled ? [0, 5, 10, 15, 20] : []}
                dataBinThreshold={24}
                xScaleDomain={scaleXDomain}
                tickInterval={Layout.isSmallDevice ? "hour" : "default"}
                totalSleepHour={props.totalSleepHour}
            />
        ) : undefined;
    const chartMovement =
        movementEvents.length > 0 ? (
            <ChartMovement
                width={width}
                height={chartMovementHeight}
                movement={movementEvents.slice()}
                dataBins={isFilterEnabled ? [0, 5, 10, 15, 20] : []}
                dataBinThreshold={24}
                xScaleDomain={scaleXDomain}
            />
        ) : undefined;
    return (
        <View style={{ position: "absolute" }}>
            {chartSleep}
            {chartMovement}
        </View>
    );
};
