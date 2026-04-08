import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import { RefreshIcon } from "../../components/atoms/RefreshIcon";

const meta = {
    title: "Atoms/RefreshIcon",
    component: RefreshIcon,
    tags: ["autodocs"],
} satisfies Meta<typeof RefreshIcon>;

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
