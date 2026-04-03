import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../constants";
import { ChartRadialProgress } from "../../components/charts/ChartRadialProgress";

const meta = {
    title: "Charts/ChartRadialProgress",
    component: ChartRadialProgress,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ChartRadialProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        width: 150,
        height: 150,
        value: 75,
        valueLabel: "75%",
        bgColor: "#2a2a4a",
        fgColor: "#00d4ff",
        minValue: 0,
        maxValue: 100,
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Full: Story = {
    args: {
        width: 150,
        height: 150,
        value: 100,
        valueLabel: "100%",
        bgColor: "#1a1a3a",
        fgColor: "#00ff88",
        minValue: 0,
        maxValue: 100,
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Empty: Story = {
    args: {
        width: 150,
        height: 150,
        value: 0,
        valueLabel: "0%",
        bgColor: "#1a1a3a",
        fgColor: "#00d4ff",
        minValue: 0,
        maxValue: 100,
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
