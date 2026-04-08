import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { ValidatableTextBox } from "../../components/molecules/ValidatableTextBox";
import { Theme } from "../../constants";

const meta = {
    title: "Molecules/ValidatableTextBox",
    component: ValidatableTextBox,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ValidatableTextBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        label: "Email",
        value: "user@example.com",
        helperText: "",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const WithError: Story = {
    args: {
        label: "Email",
        value: "invalid",
        helperText: "Please enter a valid email",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
