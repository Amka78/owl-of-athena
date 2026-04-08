import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { LabeledSelectorMenu } from "../../components/molecules/LabeledSelectorMenu";
import { Theme } from "../../constants";

const meta = {
    title: "Molecules/LabeledSelectorMenu",
    component: LabeledSelectorMenu,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof LabeledSelectorMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        label: "Language",
        value: "English",
        onPress: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
