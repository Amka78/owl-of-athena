import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { FieldToggle } from "../../components/atoms/FieldToggle";
import { Theme } from "../../constants";

const meta = {
    title: "Atoms/FieldToggle",
    component: FieldToggle,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof FieldToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        value: "enabled",
        field: {
            type: "toggle",
            valueEnabled: "enabled",
            valueDisabled: "disabled",
        },
        disabled: false,
        onValueChange: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const ToggledOff: Story = {
    args: {
        value: "disabled",
        field: {
            type: "toggle",
            valueEnabled: "enabled",
            valueDisabled: "disabled",
        },
        disabled: false,
        onValueChange: fn(),
    },
};

export const Disabled: Story = {
    args: {
        value: "enabled",
        field: {
            type: "toggle",
            valueEnabled: "enabled",
            valueDisabled: "disabled",
        },
        disabled: true,
        onValueChange: fn(),
    },
};
