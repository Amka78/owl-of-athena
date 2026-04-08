import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { ProfileListScreenTemplate } from "../../components/templates/ProfileListScreenTemplate";
import { Theme } from "../../constants";

const filterMenuProps = {
    showOfficialCheckBoxStatus: "checked" as const,
    onShowOfficialCheckBoxPress: fn(),
    showCommunityCheckBoxStatus: "unchecked" as const,
    onShowCommunityCheckBoxPress: fn(),
    showPrivateCheckBoxStatus: "checked" as const,
    onShowPrivateCheckBoxPress: fn(),
};

const mobileDimens = {
    fontScale: 1,
    scale: 1,
    height: 800,
    width: 400,
    isDesktop: false,
    isLargeWidth: false,
    isSmallHeight: false,
    isVertical: true,
    isHorizontal: false,
};

const sampleProfiles = [
    {
        id: "p1",
        content: "",
        name: "official.prof",
        title: "Official Profile",
        type: "official" as const,
        description: "Official",
        min_firmware_version: 20206,
        created_at: 1504827468,
        updated_at: 1504827468,
        starred: false,
        options: [],
    },
    {
        id: "p2",
        content: "",
        name: "community.prof",
        title: "Community Profile",
        type: "community" as const,
        description: "Community",
        min_firmware_version: 20206,
        created_at: 1504827468,
        updated_at: 1504827468,
        starred: true,
        options: [],
    },
];

const meta = {
    title: "Templates/ProfileListScreenTemplate",
    component: ProfileListScreenTemplate,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ProfileListScreenTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnUSLocale: Story = {
    args: {
        userId: "p2",
        showFilter: false,
        filterMenuProps,
        list: sampleProfiles,
        onStarPress: fn(),
        onDeletePress: fn(),
        onMenuPress: fn(),
        dimens: mobileDimens,
        locale: "en-US",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const JaJPLocale: Story = {
    args: {
        userId: "p2",
        showFilter: false,
        filterMenuProps,
        list: sampleProfiles,
        onStarPress: fn(),
        onDeletePress: fn(),
        onMenuPress: fn(),
        dimens: mobileDimens,
        locale: "ja-JP",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const WithFilter: Story = {
    args: {
        userId: "p2",
        showFilter: true,
        filterMenuProps,
        list: sampleProfiles,
        onStarPress: fn(),
        onDeletePress: fn(),
        onMenuPress: fn(),
        dimens: mobileDimens,
        locale: "en-US",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
