//#region Import Modules
import moment, { type Moment } from "moment";
import { useCallback, useState } from "react";
import type { AuroraSession, AuroraSessionDetail } from "../../sdk/models";
import type { CurrentChart } from "../../types/CurrentChart";
import { useCheckLogging } from "..";
import { useSelectedSessionDetailSelector, useSelectedSessionSelector } from "./";

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
    selectedSessionDetail: AuroraSessionDetail | undefined;
    asleepAt?: Moment;
    awakeAt?: Moment;
    sleepDuration?: Duration;
    remDuration?: Duration;
    deepDuration?: Duration;
    radialProgress: number;
    chartSelectButtonPress: () => void;
    currentChart: CurrentChart;
    scaleXDomain: number[];
    hasSleepData: boolean;
    showSettings: boolean;
    isFilterEnabled: boolean;
    showTimeline: boolean;
    showStimEvents: boolean;
    showAwakeningEvents: boolean;
    showButtonEvents: boolean;
    onSettingsPress: () => void;
    onFilterToggle: () => void;
    onTimelineToggle: () => void;
    onStimEventsToggle: () => void;
    onAwakeningEventsToggle: () => void;
    onButtonEventsToggle: () => void;
} => {
    useCheckLogging();
    const selectedSession = useSelectedSessionSelector()!;
    const selectedSessionDetail = useSelectedSessionDetailSelector();

    const [currentChart, setCurrentChart] = useState<CurrentChart>("PieChart");
    const [showSettings, setShowSettings] = useState(false);
    const [isFilterEnabled, setIsFilterEnabled] = useState(true);
    const [showTimeline, setShowTimeline] = useState(true);
    const [showStimEvents, setShowStimEvents] = useState(true);
    const [showAwakeningEvents, setShowAwakeningEvents] = useState(false);
    const [showButtonEvents, setShowButtonEvents] = useState(false);

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
        radialProgress = selectedSession.sleepScore;
        scaleXDomain = [
            selectedSession.sessionAt! - 300000,
            selectedSession.sessionAt! + selectedSession.sessionDuration! + 300000,
        ];
    }

    const chartSelectButtonPress = useCallback((): void => {
        currentChart === "SleepChart" ? setCurrentChart("PieChart") : setCurrentChart("SleepChart");
    }, [currentChart]);

    const onSettingsPress = useCallback((): void => {
        setShowSettings((value) => !value);
    }, []);
    const onFilterToggle = useCallback((): void => {
        setIsFilterEnabled((value) => !value);
    }, []);
    const onTimelineToggle = useCallback((): void => {
        setShowTimeline((value) => !value);
    }, []);
    const onStimEventsToggle = useCallback((): void => {
        setShowStimEvents((value) => !value);
    }, []);
    const onAwakeningEventsToggle = useCallback((): void => {
        setShowAwakeningEvents((value) => !value);
    }, []);
    const onButtonEventsToggle = useCallback((): void => {
        setShowButtonEvents((value) => !value);
    }, []);

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
        scaleXDomain: scaleXDomain ?? [],
        hasSleepData: !!selectedSessionDetail?.sleepEvents?.length,
        showSettings,
        isFilterEnabled,
        showTimeline,
        showStimEvents,
        showAwakeningEvents,
        showButtonEvents,
        onSettingsPress,
        onFilterToggle,
        onTimelineToggle,
        onStimEventsToggle,
        onAwakeningEventsToggle,
        onButtonEventsToggle,
    };
};
//#endregion

const getDuration = (ms: number): Duration => {
    const minutes = Math.ceil((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return { hours, minutes };
};
