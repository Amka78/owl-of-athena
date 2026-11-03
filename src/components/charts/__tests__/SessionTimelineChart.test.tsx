import { render } from "@testing-library/react-native";
import type React from "react";

import { SessionTimelineChart } from "../SessionTimelineChart";

const sessionStart = 1620000000000;
const sessionEnd = sessionStart + 8 * 60 * 60 * 1000;

const defaultProps = {
    width: 500,
    height: 100,
    scaleXDomain: [sessionStart, sessionEnd],
    asleepAt: sessionStart + 30 * 60 * 1000,
    awakeAt: sessionEnd - 30 * 60 * 1000,
    stimEvents: [
        {
            eventAt: sessionStart + 2 * 60 * 60 * 1000,
            flags: 2,
            bins: [],
            time: 0,
        },
    ],
    awakeningEvents: [
        {
            eventAt: sessionStart + 4 * 60 * 60 * 1000,
            flags: 1,
            bins: [],
            time: 0,
        },
    ],
    buttonEvents: [
        {
            eventAt: sessionStart + 5 * 60 * 60 * 1000,
            flags: 1,
            bins: [],
            time: 0,
        },
    ],
    showStimEvents: true,
    showAwakeningEvents: true,
    showButtonEvents: true,
};

describe("SessionTimelineChart", () => {
    it("renders the timeline with all event types", () => {
        const { toJSON } = render(<SessionTimelineChart {...defaultProps}></SessionTimelineChart>);
        expect(toJSON()).toBeTruthy();
    });

    it("renders without events", () => {
        const { toJSON } = render(
            <SessionTimelineChart
                {...defaultProps}
                stimEvents={[]}
                awakeningEvents={[]}
                buttonEvents={[]}
            ></SessionTimelineChart>,
        );
        expect(toJSON()).toBeTruthy();
    });

    it("renders without boundaries", () => {
        const { toJSON } = render(
            <SessionTimelineChart
                {...defaultProps}
                asleepAt={undefined}
                awakeAt={undefined}
            ></SessionTimelineChart>,
        );
        expect(toJSON()).toBeTruthy();
    });
});
