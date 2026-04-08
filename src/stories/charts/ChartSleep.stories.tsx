import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { ChartSleep } from "../../components/charts/ChartSleep";
import { Theme } from "../../constants";
import type { AuroraEvent } from "../../sdk/models";

const sessionStart = Date.now() - 7 * 3600000;
const sessionEnd = Date.now();

// Sleep stage flags: 1=Deep, 2=Light, 3=REM, 4=Awake
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

const meta = {
    title: "Charts/ChartSleep",
    component: ChartSleep,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ChartSleep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        width: 600,
        height: 200,
        sleep: sampleSleep,
        totalSleepHour: 7,
        tickInterval: "hour",
        xScaleDomain: [sessionStart, sessionEnd],
        dataBins: [],
        dataBinThreshold: 16,
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Empty: Story = {
    args: {
        width: 600,
        height: 200,
        sleep: [],
        totalSleepHour: 0,
        tickInterval: "default",
        xScaleDomain: [sessionStart, sessionEnd],
        dataBins: [],
        dataBinThreshold: 16,
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
