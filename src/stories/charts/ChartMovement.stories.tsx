import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../constants";
import { ChartMovement } from "../../components/charts/ChartMovement";
import { AuroraEvent } from "../../sdk/models";

const now = Date.now();
const sampleMovement: AuroraEvent[] = [
    { auroraEventId: 1, bins: [], eventAt: now - 3600000, flags: 1, id: 1, time: 0 } as AuroraEvent,
    { auroraEventId: 2, bins: [], eventAt: now - 2700000, flags: 2, id: 2, time: 900000 } as AuroraEvent,
    { auroraEventId: 3, bins: [], eventAt: now - 1800000, flags: 1, id: 3, time: 1800000 } as AuroraEvent,
    { auroraEventId: 4, bins: [], eventAt: now - 900000, flags: 3, id: 4, time: 2700000 } as AuroraEvent,
];

const meta = {
    title: "Charts/ChartMovement",
    component: ChartMovement,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ChartMovement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        width: 400,
        height: 80,
        movement: sampleMovement,
        xScaleDomain: [now - 3600000, now],
        dataBins: [],
        dataBinThreshold: 16,
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Empty: Story = {
    args: {
        width: 400,
        height: 80,
        movement: [],
        xScaleDomain: [now - 3600000, now],
        dataBins: [],
        dataBinThreshold: 16,
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
