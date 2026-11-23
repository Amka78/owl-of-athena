import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { ProfileDesktopScreen } from "../../components/pages/ProfileDesktopScreen";
import { ProfileScreen } from "../../components/pages/ProfileScreen";
import { Theme } from "../../constants";
import { renderAt } from "../support/deviceSize";

const sampleProfile = {
    id: "profile-001",
    content: "",
    name: "default.prof",
    title: "Default Profile",
    type: "official",
    description: "A sample profile.",
    min_firmware_version: 20206,
    created_at: 1504827468,
    updated_at: 1504827468,
    starred: false,
    options: [],
};

vi.mock("../../hooks/profiles/useProfile", async () => {
    const { getDimens } = await import("../support/deviceSize");
    const { defaultOptions, groupingProfileOptionList } = await import(
        "../../services/ProfileService"
    );
    return {
        useProfile: () => ({
            auroraConnected: true,
            hasUnsavedChanges: false,
            selectedProfile: sampleProfile,
            isUserProfile: true,
            onSaveAsNewPress: vi.fn(),
            onOverwriteSavePress: vi.fn(),
            onCancelPress: vi.fn(),
            onInfoPress: vi.fn(),
            onSaveToAuroraPress: vi.fn(),
            onShowAdvancedOptionsPress: vi.fn(),
            groupedOptionList: groupingProfileOptionList(defaultOptions),
            optionValues: {},
            optionValuesKey: 0,
            showAdvancedOptions: false,
            onOptionValueChange: vi.fn(),
            onPreviewEffectPress: vi.fn(),
            onPreviewSongPress: vi.fn(),
            dimens: getDimens(),
        }),
    };
});

// Desktop バリアントでは実アプリが表示する ProfileDesktopScreen を描画するため、
// そちらが使う ProfileTabNavigator / useProfileList もモックする。
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

export const Mobile: Story = {
    render: renderAt("mobile", ProfileScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", ProfileScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

// 実アプリは isDesktop && isHorizontal のとき ProfileDesktopScreen を表示するため、
// Desktop バリアントはそちらを描画する。
export const Desktop: Story = {
    render: renderAt("desktop", ProfileDesktopScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
