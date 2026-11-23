import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { ProfileMenu } from "../../../components/features/profiles/ProfileMenu";
import { Theme } from "../../../constants";

const meta = {
    title: "Organisms/ProfileMenu",
    component: ProfileMenu,
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ProfileMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        selectedProfile: {
            content: "",
            id: "",
            key: "",
            name: "test",
            title: "test",
            starred: false,
            type: "community",
            created_at: 0,
            updated_at: 0,
            min_firmware_version: 0,
            options: [],
        },
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
