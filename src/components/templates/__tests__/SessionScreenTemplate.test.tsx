import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import type { AuroraSession } from "../../../sdk/models";
import { SessionScreenTemplate } from "../SessionScreenTemplate";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const mockSessionDetail = {
    sleepEvents: [],
    movementEvents: [],
};

const defaultProps = {
    asleepAtTimeLabel: { hours: 23, minutes: 0 },
    chartRadialProgress: { value: 75, valueLabel: "75" },
    awakeTimeLabel: { hours: 7, minutes: 30 },
    leftSelectButton: { onPress: jest.fn() },
    rightSelectButton: { onPress: jest.fn() },
    currentChart: "SleepChart" as const,
    sessionSleepChart: {
        scaleXDomain: [],
        isFilterEnabled: true,
        sessionDetail: mockSessionDetail as any,
        totalSleepHour: 8,
    },
    sessionTimeline: {
        scaleXDomain: [1620000000000, 1620028800000],
        asleepAt: 1620000000000,
        awakeAt: 1620028800000,
        stimEvents: [],
        awakeningEvents: [],
        buttonEvents: [],
        showStimEvents: true,
        showAwakeningEvents: false,
        showButtonEvents: false,
    },
    showTimeline: true,
    hasSleepData: true,
    showSettings: false,
    onSettingsPress: jest.fn(),
    onExportPress: jest.fn(),
    sessionDetailsMenu: {
        isFilterEnabled: true,
        showTimeline: true,
        showStimEvents: true,
        showAwakeningEvents: false,
        showButtonEvents: false,
        onFilterToggle: jest.fn(),
        onTimelineToggle: jest.fn(),
        onStimEventsToggle: jest.fn(),
        onAwakeningEventsToggle: jest.fn(),
        onButtonEventsToggle: jest.fn(),
        onExportJsonPress: jest.fn(),
        onExportCsvPress: jest.fn(),
        onDownloadZipPress: jest.fn(),
    },
    sessionChartPie: {
        session: null as unknown as AuroraSession,
    },
    sleepDurationLabel: { hours: 8, minutes: 30 },
    remDurationLabel: { hours: 1, minutes: 45 },
    deepDurationLabel: { hours: 0, minutes: 45 },
};

describe("SessionScreenTemplate", () => {
    it("renders correctly with en-US locale", () => {
        const { toJSON } = renderWithProvider(
            <SessionScreenTemplate {...defaultProps} locale="en-US" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders correctly with ja-JP locale", () => {
        const { toJSON } = renderWithProvider(
            <SessionScreenTemplate {...defaultProps} locale="ja-JP" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
