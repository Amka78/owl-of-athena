import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import { DeleteIcon } from "../../components/atoms/DeleteIcon";

const meta = {
    title: "Atoms/DeleteIcon",
    component: DeleteIcon,
    tags: ["autodocs"],
} satisfies Meta<typeof DeleteIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {},
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const WithPressHandler: Story = {
    args: {
        onPress: fn(),
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};
