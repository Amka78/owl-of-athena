import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { ProfileDesktopScreen } from "../../components/pages/ProfileDesktopScreen";
import { Theme } from "../../constants";
import { renderAt } from "../support/deviceSize";

// ProfileDesktopScreen は実アプリではデスクトップ（isDesktop && isHorizontal）でのみ表示される。
// Mobile / Tablet バリアントは確認用に同画面を小さいキャンバスで描画する。
vi.mock("../../navigation/ProfileTabNavigator", () => {
    const React = require("react");
    const { View, Text } = require("react-native");
    return {
        default: () => (
            <View>
                <Text>ProfileTabNavigator</Text>
            </View>
        ),
    };
});

vi.mock("../../hooks/profiles/useProfileList", () => ({
    useProfileList: () => ({
        showFilter: false,
        filterCondition: {
            showOfficial: true,
            showCommunity: true,
            showPrivate: true,
        },
        onShowOfficialPress: vi.fn(),
        onShowCommunityPress: vi.fn(),
        onShowPrivatePress: vi.fn(),
        onFilterPress: vi.fn(),
        onRefreshPress: vi.fn(),
        userId: "guest",
        list: [],
        onStarPress: vi.fn(),
        onSelectProfile: vi.fn(),
        onDeleteProfile: vi.fn(),
    }),
}));

vi.mock("../../hooks", async () => {
    const { hooksMock } = await import("../support/deviceSize");
    return hooksMock({
        useProfileList: () => ({
            showFilter: false,
            filterCondition: {
                showOfficial: true,
                showCommunity: true,
                showPrivate: true,
            },
            onShowOfficialPress: vi.fn(),
            onShowCommunityPress: vi.fn(),
            onShowPrivatePress: vi.fn(),
            onFilterPress: vi.fn(),
            onRefreshPress: vi.fn(),
            userId: "guest",
            list: [],
            onStarPress: vi.fn(),
            onSelectProfile: vi.fn(),
            onDeleteProfile: vi.fn(),
        }),
    });
});

vi.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: vi.fn(), goBack: vi.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: vi.fn(),
}));

const meta = {
    title: "Pages/ProfileDesktopScreen",
    component: ProfileDesktopScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ProfileDesktopScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    render: renderAt("mobile", ProfileDesktopScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", ProfileDesktopScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    render: renderAt("desktop", ProfileDesktopScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
