//#region Import Modules
import moment, { type Moment } from "moment";
import { useCallback, useState } from "react";
import { ConfirmDialog } from "../../components/molecules/ConfirmDialog";
import { Message, MessageKeys } from "../../constants";
import type { AuroraSession, AuroraSessionDetail } from "../../sdk/models";
import {
    buildSessionEventsCsv,
    buildSessionExportJson,
    shareText,
} from "../../services/ExportService";
import type { CurrentChart } from "../../types/CurrentChart";
import { useCheckLogging } from "../useCheckLogging";
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
    onExportPress: () => Promise<void>;
    onExportCsvPress: () => Promise<void>;
    onDownloadZipPress: () => Promise<void>;
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

    const exportSession = useCallback(
        async (format: "json" | "csv"): Promise<void> => {
            if (!selectedSession) return;

            try {
                await shareText(
                    Message.get(MessageKeys.session_export_title),
                    format === "json"
                        ? buildSessionExportJson(selectedSession, selectedSessionDetail)
                        : buildSessionEventsCsv(selectedSession, selectedSessionDetail),
                );
            } catch (error) {
                console.debug("session export failed:", error);
                ConfirmDialog.show({
                    title: Message.get(MessageKeys.session_export_title),
                    message: Message.get(MessageKeys.export_failed),
                });
            }
        },
        [selectedSession, selectedSessionDetail],
    );

    const onExportPress = useCallback((): Promise<void> => exportSession("json"), [exportSession]);
    const onExportCsvPress = useCallback(
        (): Promise<void> => exportSession("csv"),
        [exportSession],
    );

    const onDownloadZipPress = useCallback(async (): Promise<void> => {
        if (!selectedSession) return;

        try {
            const { downloadSessionZip } = await import("../../services/SessionZipDownloadService");
            await downloadSessionZip(selectedSession, selectedSessionDetail);
        } catch (error) {
            console.debug("session zip download failed:", error);
            ConfirmDialog.show({
                title: Message.get(MessageKeys.session_export_title),
                message: Message.get(MessageKeys.export_failed),
            });
        }
    }, [selectedSession, selectedSessionDetail]);

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
        onExportPress,
        onExportCsvPress,
        onDownloadZipPress,
    };
};
//#endregion

const getDuration = (ms: number): Duration => {
    const minutes = Math.ceil((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return { hours, minutes };
};
