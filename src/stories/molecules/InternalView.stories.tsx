import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Text } from "react-native";
import { Provider } from "react-native-paper";
import { InternalView } from "../../components/molecules/InternalView";
import { Theme } from "../../constants";

const meta = {
    title: "Molecules/InternalView",
    component: InternalView,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof InternalView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        children: <Text>Internal content</Text>,
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
