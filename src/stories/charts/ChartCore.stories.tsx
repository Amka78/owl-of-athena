import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { ChartCore } from "../../components/charts/ChartCore";
import { Theme } from "../../constants";

const meta = {
    title: "Charts/ChartCore",
    component: ChartCore,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ChartCore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        width: 400,
        height: 200,
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const WithMargin: Story = {
    args: {
        width: 400,
        height: 200,
        svgStyle: { marginLeft: 16, marginRight: 16, marginTop: 8, marginBottom: 8 },
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
