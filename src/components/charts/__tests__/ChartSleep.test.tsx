import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import type { AuroraEvent } from "../../../sdk/models";
import { ChartSleep } from "../ChartSleep";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const sessionStart = 1620000000000;
const sessionEnd = 1620025200000; // 7 hours later

const sampleSleep: AuroraEvent[] = [
    { auroraEventId: 1, bins: [], eventAt: sessionStart, flags: 2, id: 1, time: 0 } as AuroraEvent,
    {
        auroraEventId: 2,
        bins: [],
        eventAt: sessionStart + 3600000,
        flags: 1,
        id: 2,
        time: 3600000,
    } as AuroraEvent,
    {
        auroraEventId: 3,
        bins: [],
        eventAt: sessionStart + 7200000,
        flags: 3,
        id: 3,
        time: 7200000,
    } as AuroraEvent,
    {
        auroraEventId: 4,
        bins: [],
        eventAt: sessionStart + 10800000,
        flags: 2,
        id: 4,
        time: 10800000,
    } as AuroraEvent,
    {
        auroraEventId: 5,
        bins: [],
        eventAt: sessionStart + 14400000,
        flags: 4,
        id: 5,
        time: 14400000,
    } as AuroraEvent,
];

const defaultProps = {
    width: 600,
    height: 200,
    sleep: sampleSleep,
    totalSleepHour: 7,
    tickInterval: "hour" as const,
    xScaleDomain: [sessionStart, sessionEnd],
    dataBins: [] as number[],
    dataBinThreshold: 16,
};

describe("ChartSleep UnitTest", () => {
    // ChartSleep uses ClippedG which generates a random clipPath ID each render,
    // so we verify rendering without crashing rather than using snapshots.
    it("renders without crashing with sleep data", () => {
        expect(() => renderWithProvider(<ChartSleep {...defaultProps} />)).not.toThrow();
    });

    it("renders without crashing with hour tick interval", () => {
        expect(() =>
            renderWithProvider(<ChartSleep {...defaultProps} tickInterval="hour" />),
        ).not.toThrow();
    });

    it("renders without crashing with default tick interval", () => {
        expect(() =>
            renderWithProvider(<ChartSleep {...defaultProps} tickInterval="default" />),
        ).not.toThrow();
    });

    it("renders a non-null tree", () => {
        const { toJSON } = renderWithProvider(<ChartSleep {...defaultProps} />);
        expect(toJSON()).not.toBeNull();
    });
});
