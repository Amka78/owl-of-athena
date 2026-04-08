import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import { StarIcon } from "../../components/atoms/StarIcon";

const meta = {
    title: "Atoms/StarIcon",
    component: StarIcon,
    tags: ["autodocs"],
} satisfies Meta<typeof StarIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        starred: true,
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Unstarred: Story = {
    args: {
        starred: false,
    },
};

export const WithPressHandler: Story = {
    args: {
        starred: true,
        onPress: fn(),
    },
};

export const Disabled: Story = {
    args: {
        starred: true,
        disabled: true,
    },
};
