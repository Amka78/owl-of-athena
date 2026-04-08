import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { ProfilePreviewScreenTemplate } from "../../components/templates/ProfilePreviewScreenTemplate";
import { Theme } from "../../constants";

const meta = {
    title: "Templates/ProfilePreviewScreenTemplate",
    component: ProfilePreviewScreenTemplate,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ProfilePreviewScreenTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        content: JSON.stringify({ name: "default.prof", version: "1.0.0" }, null, 2),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Empty: Story = {
    args: {
        content: "",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
