import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { SessionNoteScreenTemplate } from "../../components/templates/SessionNoteScreenTemplate";
import { Theme } from "../../constants";

const meta = {
    title: "Templates/SessionNoteScreenTemplate",
    component: SessionNoteScreenTemplate,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof SessionNoteScreenTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
    args: {
        value: "",
        onChangeText: fn(),
        onBlur: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const WithNote: Story = {
    args: {
        value: "Had a vivid dream about flying over mountains.",
        onChangeText: fn(),
        onBlur: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
