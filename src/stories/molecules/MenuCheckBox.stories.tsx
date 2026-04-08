import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { MenuCheckBox } from "../../components/molecules/MenuCheckBox";
import { Theme } from "../../constants";

const meta = {
    title: "Molecules/MenuCheckBox",
    component: MenuCheckBox,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof MenuCheckBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
    args: {
        label: "Enable feature",
        status: "checked",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Unchecked: Story = {
    args: {
        label: "Enable feature",
        status: "unchecked",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
