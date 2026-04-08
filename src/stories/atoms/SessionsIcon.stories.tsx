import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import { SessionsIcon } from "../../components/atoms/SessionsIcon";

const meta = {
    title: "Atoms/SessionsIcon",
    component: SessionsIcon,
    tags: ["autodocs"],
} satisfies Meta<typeof SessionsIcon>;

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
