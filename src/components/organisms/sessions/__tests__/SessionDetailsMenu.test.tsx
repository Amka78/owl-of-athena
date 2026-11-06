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
    onFilterToggle: jest.fn(),
    onTimelineToggle: jest.fn(),
    onStimEventsToggle: jest.fn(),
    onAwakeningEventsToggle: jest.fn(),
    onButtonEventsToggle: jest.fn(),
    onExportJsonPress: jest.fn(),
    onExportCsvPress: jest.fn(),
    onDownloadZipPress: jest.fn(),
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
        const onStimEventsToggle = jest.fn();
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
        const onFilterToggle = jest.fn();
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
        const onExportJsonPress = jest.fn();
        const onExportCsvPress = jest.fn();
        const onDownloadZipPress = jest.fn();
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
