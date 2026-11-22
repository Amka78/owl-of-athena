import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../../constants";
import { SessionDetailsMenu } from "../SessionDetailsMenu";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const defaultProps = {
    isFilterEnabled: true,
    showTimeline: true,
    showStimEvents: true,
    showAwakeningEvents: false,
    showButtonEvents: false,
    onFilterToggle: vi.fn(),
    onTimelineToggle: vi.fn(),
    onStimEventsToggle: vi.fn(),
    onAwakeningEventsToggle: vi.fn(),
    onButtonEventsToggle: vi.fn(),
    onExportJsonPress: vi.fn(),
    onExportCsvPress: vi.fn(),
    onDownloadZipPress: vi.fn(),
};

describe("SessionDetailsMenu", () => {
    it("renders all options", () => {
        const { getByText } = renderWithProvider(
            <SessionDetailsMenu {...defaultProps}></SessionDetailsMenu>,
        );

        expect(getByText("Filter Data")).toBeTruthy();
        expect(getByText("Show Timeline")).toBeTruthy();
        expect(getByText("Show REM Stims")).toBeTruthy();
        expect(getByText("Show Awakenings")).toBeTruthy();
        expect(getByText("Show Button Presses")).toBeTruthy();
    });

    it("disables the event toggles when the timeline is hidden", () => {
        const onStimEventsToggle = vi.fn();
        const { getByTestId } = renderWithProvider(
            <SessionDetailsMenu
                {...defaultProps}
                showTimeline={false}
                onStimEventsToggle={onStimEventsToggle}
            ></SessionDetailsMenu>,
        );

        fireEvent(getByTestId("session-details-stim-events"), "valueChange", true);
        expect(onStimEventsToggle).not.toHaveBeenCalled();
    });

    it("toggles filter data", () => {
        const onFilterToggle = vi.fn();
        const { getByTestId } = renderWithProvider(
            <SessionDetailsMenu
                {...defaultProps}
                onFilterToggle={onFilterToggle}
            ></SessionDetailsMenu>,
        );

        fireEvent(getByTestId("session-details-filter-data"), "valueChange", false);
        expect(onFilterToggle).toHaveBeenCalledTimes(1);
    });

    it("offers JSON, CSV, and ZIP downloads", () => {
        const onExportJsonPress = vi.fn();
        const onExportCsvPress = vi.fn();
        const onDownloadZipPress = vi.fn();
        const { getByText } = renderWithProvider(
            <SessionDetailsMenu
                {...defaultProps}
                onExportJsonPress={onExportJsonPress}
                onExportCsvPress={onExportCsvPress}
                onDownloadZipPress={onDownloadZipPress}
            ></SessionDetailsMenu>,
        );

        fireEvent.press(getByText("Share JSON"));
        fireEvent.press(getByText("Share CSV"));
        fireEvent.press(getByText("Download ZIP"));
        expect(onExportJsonPress).toHaveBeenCalledTimes(1);
        expect(onExportCsvPress).toHaveBeenCalledTimes(1);
        expect(onDownloadZipPress).toHaveBeenCalledTimes(1);
    });
});
