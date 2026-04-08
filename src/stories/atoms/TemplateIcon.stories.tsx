import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import { TemplateIcon } from "../../components/atoms/TemplateIcon";

const meta = {
    title: "Atoms/TemplateIcon",
    component: TemplateIcon,
    tags: ["autodocs"],
} satisfies Meta<typeof TemplateIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        name: "home",
        size: 40,
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const WithPressHandler: Story = {
    args: {
        name: "home",
        size: 40,
        onPress: fn(),
    },
};

export const Disabled: Story = {
    args: {
        name: "home",
        size: 40,
        disabled: true,
    },
};
