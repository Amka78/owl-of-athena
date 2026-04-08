import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { ProfileMenu } from "../../components/organisms/profiles/ProfileMenu";
import { Theme } from "../../constants";

const sampleProfile = {
    id: "profile-001",
    content: "",
    name: "default.prof",
    title: "Default Profile",
    type: "official" as const,
    description: "A sample profile for testing.",
    min_firmware_version: 20206,
    created_at: 1504827468,
    updated_at: 1504827468,
    starred: false,
    options: [],
};

const meta = {
    title: "Organisms/ProfileMenu",
    component: ProfileMenu,
    tags: ["autodocs"],
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
        selectedProfile: sampleProfile,
        onEditPress: fn(),
        onInfoPress: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const CommunityProfile: Story = {
    args: {
        selectedProfile: { ...sampleProfile, type: "community", title: "Community Profile" },
        onEditPress: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
