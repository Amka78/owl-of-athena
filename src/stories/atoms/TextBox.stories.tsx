import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { TextBox } from "../../components/atoms/TextBox";
import { Theme } from "../../constants";

const meta = {
    title: "Atoms/TextBox",
    component: TextBox,
    tags: ["autodocs"],
    argTypes: {
        selectionColor: { control: "color" },
        underlineColor: { control: "color" },
    },
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof TextBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        label: "test",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
