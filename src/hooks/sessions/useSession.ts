//#region Import Modules
import moment, { Moment } from "moment";
import { useCallback, useState } from "react";

import { useCheckLogging } from "..";
import { AuroraSession, AuroraSessionDetail } from "../../sdk/models";
import { CurrentChart } from "../../types/CurrentChart";
import {
    useSelectedSessionDetailSelector,
    useSelectedSessionSelector,
} from "./";

//#endregion

//#region Types
type Duration = {
    hours: number;
    minutes: number;
};
//#endregion

//#region Hooks
export const useSession = (): {
    selectedSession: AuroraSession;
    selectedSessionDetail: AuroraSessionDetail;
    asleepAt?: Moment;
    awakeAt?: Moment;
    sleepDuration?: Duration;
    remDuration?: Duration;
    deepDuration?: Duration;
    radialProgress: number;
    chartSelectButtonPress: () => void;
    currentChart: CurrentChart;
    scaleXDomain: number[];
} => {
    useCheckLogging();
    const selectedSession = useSelectedSessionSelector()!;
    const selectedSessionDetail = useSelectedSessionDetailSelector();

    const [currentChart, setCurrentChart] = useState<CurrentChart>("PieChart");

    let asleepAt: Moment | undefined;
    let awakeAt: Moment | undefined;
    let sleepDuration: Duration | undefined;
    let remDuration: Duration | undefined;
    let deepDuration: Duration | undefined;
    let radialProgress: number;
    let scaleXDomain: number[] | undefined;

    radialProgress = 0;

    if (selectedSession) {
        asleepAt = moment(selectedSession.asleepAt).utc();
        awakeAt = moment(selectedSession.awakeAt).utc();
        sleepDuration = getDuration(selectedSession.sleepDuration);
        remDuration = getDuration(selectedSession.remDuration);
        deepDuration = getDuration(selectedSession.deepDuration);
        radialProgress =
            selectedSession.sleepScore == 117 ? 72 : selectedSession.sleepScore;
        scaleXDomain = [
            selectedSession.sessionAt! - 300000,
            selectedSession.sessionAt! +
                selectedSession.sessionDuration! +
                300000,
        ];
    }

    const chartSelectButtonPress = useCallback((): void => {
        currentChart === "SleepChart"
            ? setCurrentChart("PieChart")
            : setCurrentChart("SleepChart");
    }, [currentChart]);

    return {
        selectedSession,
        selectedSessionDetail,
        asleepAt,
        awakeAt,
        sleepDuration,
        remDuration,
        deepDuration,
        radialProgress,
        chartSelectButtonPress,
        currentChart,
        scaleXDomain,
    };
};
//#endregion

const getDuration = (ms: number): Duration => {
    const minutes = Math.ceil((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return { hours, minutes };
};
