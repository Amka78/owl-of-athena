import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import { FieldSlider } from "../../components/atoms/FieldSlider";

const meta = {
    title: "Atoms/FieldSlider",
    component: FieldSlider,
    tags: ["autodocs"],
} satisfies Meta<typeof FieldSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        value: 30,
        field: {
            type: "slider",
            format: "minutes",
            min: 0,
            max: 60,
            step: 5,
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
        value: 30,
        field: {
            type: "slider",
            format: "minutes",
            min: 0,
            max: 60,
            step: 5,
        },
        disabled: true,
        onValueChange: fn(),
    },
};
