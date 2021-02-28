//#region "Import modules"
import React, { FunctionComponent } from "react";

import { useSession } from "../../hooks/useSession";
import { SessionBlankScreenTemplate } from "../templates/SessionBlankScreenTemplate";
import { SessionScreenTemplate } from "./../templates/SessionScreenTemplate";
//#endregion

//#region Component
export const SessionScreen: FunctionComponent = () => {
    const sessionHook = useSession();

    const selectedSession = (
        <SessionScreenTemplate
            asleepAtTimeLabel={{
                hours: sessionHook.asleepAt!.hours(),
                minutes: sessionHook.asleepAt!.minutes(),
            }}
            chartRadialProgress={{
                value: sessionHook.radialProgress,
                valueLabel: sessionHook.radialProgress.toString(),
            }}
            awakeTimeLabel={{
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
                hours: sessionHook.sleepDuration!.hours,
                minutes: sessionHook.sleepDuration!.minutes,
            }}
            remDurationLabel={{
                hours: sessionHook.remDuration!.hours,
                minutes: sessionHook.remDuration!.minutes,
            }}
            deepDurationLabel={{
                hours: sessionHook.deepDuration!.hours,
                minutes: sessionHook.deepDuration!.minutes,
            }}
        ></SessionScreenTemplate>
    );

    const blank = <SessionBlankScreenTemplate></SessionBlankScreenTemplate>;
    return sessionHook.selectedSession ? selectedSession : blank;
};
//#endregion
