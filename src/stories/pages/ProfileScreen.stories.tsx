import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../constants";
import { ProfileScreen } from "../../components/pages/ProfileScreen";

const meta = {
    title: "Pages/ProfileScreen",
    component: ProfileScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ProfileScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

// ProfileScreen is a simple empty View component — no hooks needed.
export const Primary: Story = {
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
