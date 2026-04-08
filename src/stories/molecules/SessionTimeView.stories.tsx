import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { SessionTimeView } from "../../components/molecules/SessionTimeView";
import { Theme } from "../../constants";

const meta = {
    title: "Molecules/SessionTimeView",
    component: SessionTimeView,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof SessionTimeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    args: {
        label: "Session Time",
        hours: 7,
        minutes: 30,
        mode: "meridian",
        isDesktop: false,
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    args: {
        label: "Session Time",
        hours: 8,
        minutes: 0,
        mode: "time",
        isDesktop: true,
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
