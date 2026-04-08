import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { FieldTime } from "../../components/atoms/FieldTime";
import { Theme } from "../../constants";

const meta = {
    title: "Atoms/FieldTime",
    component: FieldTime,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof FieldTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        value: "08:00",
        field: {
            type: "time",
            clearable: true,
            labelCleared: "Cleared",
            minutesStep: 5,
            defaultTime: 480,
        },
        disabled: false,
        onValueChange: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Cleared: Story = {
    args: {
        value: false,
        field: {
            type: "time",
            clearable: true,
            labelCleared: "Cleared",
            minutesStep: 5,
            defaultTime: 480,
        },
        disabled: false,
        onValueChange: fn(),
    },
};

export const Disabled: Story = {
    args: {
        value: "08:00",
        field: {
            type: "time",
            clearable: true,
            labelCleared: "Cleared",
            minutesStep: 5,
            defaultTime: 480,
        },
        disabled: true,
        onValueChange: fn(),
    },
};
