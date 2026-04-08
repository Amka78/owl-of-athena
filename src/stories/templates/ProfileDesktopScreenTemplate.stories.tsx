import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { ProfileDesktopScreenTemplate } from "../../components/templates/ProfileDesktopScreenTemplate";
import { Theme } from "../../constants";

jest.mock("../../navigation/ProfileTabNavigator", () => {
    const React = require("react");
    const { View, Text } = require("react-native");
    return () => (
        <View>
            <Text>ProfileTabNavigator</Text>
        </View>
    );
});

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
];

const meta = {
    title: "Templates/ProfileDesktopScreenTemplate",
    component: ProfileDesktopScreenTemplate,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ProfileDesktopScreenTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithList: Story = {
    args: {
        userId: "p1",
        showFilter: false,
        filterMenuProps,
        list: sampleProfiles,
        onStarPress: fn(),
        onDeletePress: fn(),
        onMenuPress: fn(),
        onRefreshPress: fn(),
        onFilterPress: fn(),
        dimens: mobileDimens,
        locale: "en-US",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const NoList: Story = {
    args: {
        userId: "p1",
        showFilter: false,
        filterMenuProps,
        list: undefined,
        onStarPress: fn(),
        onDeletePress: fn(),
        onMenuPress: fn(),
        onRefreshPress: fn(),
        onFilterPress: fn(),
        dimens: mobileDimens,
        locale: "en-US",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
