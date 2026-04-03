import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../constants";
import ChartTimeline from "../../components/charts/ChartTimeline";

const sessionStart = Date.now() - 8 * 3600000;
const sessionEnd = Date.now();

const sampleEvents = [
    {
        id: 1,
        eventAt: sessionStart + 1800000,
        flags: 1,
        bins: [],
        time: 1800000,
        label: "Smart Alarm",
        auroraEventId: 100,
    },
    {
        id: 2,
        eventAt: sessionStart + 3600000,
        flags: 2,
        bins: [],
        time: 3600000,
        label: "Deep Sleep",
        auroraEventId: 200,
    },
];

const meta = {
    title: "Charts/ChartTimeline",
    component: ChartTimeline,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ChartTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        width: 600,
        height: 100,
        events: sampleEvents,
        scaleXDomain: [sessionStart, sessionEnd],
        eventIconSize: 12,
        eventIconColor: "#fff",
        eventLabelColor: "#ccc",
        eventLabelSize: 10,
        eventLabelPosition: 20,
        eventTickColor: "#aaa",
        eventTickWidth: 1,
        eventTickSize: 20,
        eventPlacement: 0,
        axisXEnabled: true,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};
