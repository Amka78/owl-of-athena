//#region "Import modules"
import React, { FunctionComponent } from "react";

import { Message, MessageKeys } from "../constants";
import { useSession } from "../hooks/useSession";
import { SessionScreenTemplate } from "./templates/SessionScreenTemplate";
//#endregion

//#region Component
export const SessionScreen: FunctionComponent = () => {
    const sessionHook = useSession();

    return (
        <SessionScreenTemplate
            asleepAtTimeLabel={{
                label: Message.get(MessageKeys.session_asleep_time_label),
                hours: sessionHook.asleepAt!.hours(),
                minutes: sessionHook.asleepAt!.minutes(),
            }}
            chartRadialProgress={{
                value: sessionHook.radialProgress,
                valueLabel: sessionHook.radialProgress.toString(),
            }}
            awakeTimeLabel={{
                label: Message.get(MessageKeys.session_awake_time_label),
                hours: sessionHook.awakeAt!.hours(),
                minutes: sessionHook.awakeAt!.minutes(),
            }}
            leftSelectButton={{
                onPress: sessionHook.chartSelectButtonPress,
            }}
            rightSelectButton={{
                onPress: sessionHook.chartSelectButtonPress,
            }}
            currentChart={sessionHook.currentChart}
            sessionSleepChart={{
                scaleXDomain: sessionHook.scaleXDomain,
                sessionDetail: sessionHook.selectedSessionDetail,
                totalSleepHour: sessionHook.sleepDuration!.hours,
                isFilterEnabled: false,
            }}
            sessionChartPie={{
                session: sessionHook.selectedSession,
            }}
            sleepDurationLabel={{
                label: Message.get(MessageKeys.session_sleep_duration_label),
                hours: sessionHook.sleepDuration!.hours,
                minutes: sessionHook.sleepDuration!.minutes,
            }}
            remDurationLabel={{
                label: Message.get(MessageKeys.session_rem_duration_label),
                hours: sessionHook.remDuration!.hours,
                minutes: sessionHook.remDuration!.minutes,
            }}
            deepDurationLabel={{
                label: Message.get(MessageKeys.session_deep_duration_label),
                hours: sessionHook.deepDuration!.hours,
                minutes: sessionHook.deepDuration!.minutes,
            }}
        ></SessionScreenTemplate>
    );
};
//#endregion
