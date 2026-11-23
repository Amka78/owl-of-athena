import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect, fn } from "storybook/test";
import { FieldStreamCheckBoxes } from "../../components/molecules/FieldStreamCheckboxes";
import { Theme } from "../../constants";

const meta = {
    title: "Atoms/FieldStreamCheckboxes",
    component: FieldStreamCheckBoxes,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof FieldStreamCheckBoxes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        value: 0,
        field: {
            type: "checkboxes",
            choices: "option1,option2",
            labelNone: "None",
        },
        disabled: false,
        onValueChange: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Disabled: Story = {
    args: {
        value: 0,
        field: {
            type: "checkboxes",
            choices: "option1,option2",
            labelNone: "None",
        },
        disabled: true,
        onValueChange: fn(),
    },
};
