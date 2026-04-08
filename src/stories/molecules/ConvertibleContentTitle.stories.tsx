import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { ConvertibleContentTitle } from "../../components/molecules/ConvertibleContentTitle";
import { Theme } from "../../constants";

const meta = {
    title: "Molecules/ConvertibleContentTitle",
    component: ConvertibleContentTitle,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ConvertibleContentTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
    args: {
        children: "Settings",
        isDesktop: true,
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Mobile: Story = {
    args: {
        children: "Settings",
        isDesktop: false,
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
