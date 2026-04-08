import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { CheckBox } from "../../components/atoms/CheckBox";
import { Theme } from "../../constants";

const meta = {
    title: "Atoms/CheckBox",
    component: CheckBox,
    tags: ["autodocs"],
    argTypes: {
        color: { control: "color" },
        uncheckedColor: { control: "color" },
    },
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof CheckBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        status: "checked",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Unchecked: Story = {
    args: {
        status: "unchecked",
    },
};

export const Indeterminate: Story = {
    args: {
        status: "indeterminate",
    },
};

export const WithPressHandler: Story = {
    args: {
        status: "unchecked",
        onPress: fn(),
    },
};
