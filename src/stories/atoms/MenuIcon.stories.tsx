import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import { MenuIcon } from "../../components/atoms/MenuIcon";

const meta = {
    title: "Atoms/MenuIcon",
    component: MenuIcon,
    tags: ["autodocs"],
} satisfies Meta<typeof MenuIcon>;

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
