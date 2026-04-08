import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import { EditIcon } from "../../components/atoms/EditIcon";

const meta = {
    title: "Atoms/EditIcon",
    component: EditIcon,
    tags: ["autodocs"],
} satisfies Meta<typeof EditIcon>;

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
