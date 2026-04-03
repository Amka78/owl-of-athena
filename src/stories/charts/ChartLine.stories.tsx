import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../constants";
import ChartLine from "../../components/charts/ChartLine";

// EEG-style data: arrays of amplitude values (–2048 to 2048)
const generateEegChannel = (length: number, frequency: number): number[] =>
    Array.from({ length }, (_, i) => Math.sin((i / length) * frequency * Math.PI * 2) * 512);

const sampleData = [
    generateEegChannel(256, 4),
    generateEegChannel(256, 8),
];

const meta = {
    title: "Charts/ChartLine",
    component: ChartLine as React.ComponentType<any>,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ChartLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        width: 600,
        height: 200,
        data: sampleData,
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
