import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import type React from "react";
import { Provider } from "react-native-paper";
import ChartPie from "../../components/charts/ChartPie";
import { Theme } from "../../constants";

const meta = {
    title: "Charts/ChartPie",
    component: ChartPie as React.ComponentType<any>,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ChartPie>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        width: 300,
        height: 200,
        categoryPercents: [25, 35, 20, 20],
        categoryLabels: ["Deep", "Light", "REM", "Awake"],
        categoryColors: ["#3b4cca", "#9c59ff", "#00bcd4", "#ffb300"],
        legendPosition: "right",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const LegendLeft: Story = {
    args: {
        width: 300,
        height: 200,
        categoryPercents: [30, 40, 15, 15],
        categoryLabels: ["Deep", "Light", "REM", "Awake"],
        categoryColors: ["#3b4cca", "#9c59ff", "#00bcd4", "#ffb300"],
        legendPosition: "left",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
