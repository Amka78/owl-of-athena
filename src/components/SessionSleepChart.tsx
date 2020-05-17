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
    return (
        <View style={{ position: "absolute" }}>
            <ChartSleep
                width={width}
                height={chartSleepHeight}
                margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
                sleep={sleepEvents.slice()}
                dataBins={isFilterEnabled ? [0, 5, 10, 15, 20] : []}
                dataBinThreshold={24}
                scaleXDomain={scaleXDomain}
                tickInterval={Layout.isSmallDevice ? "hour" : "default"}
                totalSleepHour={props.totalSleepHour}
            />
            <ChartMovement
                width={width}
                height={chartMovementHeight}
                margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
                movement={movementEvents.slice()}
                dataBins={isFilterEnabled ? [0, 5, 10, 15, 20] : []}
                dataBinThreshold={24}
                scaleXDomain={scaleXDomain}
            />
        </View>
    );
};
