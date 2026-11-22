import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { SessionScreen } from "../SessionScreen";

vi.mock("../../../hooks/sessions/useSession", () => ({
    useSession: () => ({
        selectedSession: {},
        selectedSessionDetail: {},
        asleepAt: { hours: () => 22, minutes: () => 30 },
        awakeAt: { hours: () => 6, minutes: () => 0 },
        sleepDuration: { hours: 7, minutes: 30 },
        remDuration: { hours: 1, minutes: 45 },
        deepDuration: { hours: 2, minutes: 15 },
        radialProgress: 82,
        chartSelectButtonPress: vi.fn(),
        currentChart: "PieChart",
        scaleXDomain: [1620000000000, 1620028800000],
        hasSleepData: true,
        showSettings: false,
        isFilterEnabled: true,
        showTimeline: true,
        showStimEvents: true,
        showAwakeningEvents: false,
        showButtonEvents: false,
        onSettingsPress: vi.fn(),
        onExportPress: vi.fn(),
        onFilterToggle: vi.fn(),
        onTimelineToggle: vi.fn(),
        onStimEventsToggle: vi.fn(),
        onAwakeningEventsToggle: vi.fn(),
        onButtonEventsToggle: vi.fn(),
        onExportCsvPress: vi.fn(),
        onDownloadZipPress: vi.fn(),
    }),
}));

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("SessionScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<SessionScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<SessionScreen />)).not.toThrow();
    });
});
