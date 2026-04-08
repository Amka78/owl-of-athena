import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import { CommunityIcon } from "../../components/atoms/CommunityIcon";

const meta = {
    title: "Atoms/CommunityIcon",
    component: CommunityIcon,
    tags: ["autodocs"],
} satisfies Meta<typeof CommunityIcon>;

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
