import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { MainScreen } from "../../components/pages/MainScreen";
import { Theme } from "../../constants";
import { renderAt } from "../support/deviceSize";

// MainScreen は MainDrawerNavigator を内包するため、ドロワーはプレースホルダでモックする
// （実ナビゲーション全体の再現は story のスコープ外。Pages/MainScreen の 3 バリアントは
//   useMain の dimens 分岐の確認用途）。
vi.mock("../../navigation/MainDrawerNavigator", () => {
    const React = require("react");
    const { View, Text } = require("react-native");
    return {
        default: () => (
            <View>
                <Text>MainDrawerNavigator</Text>
            </View>
        ),
    };
});

vi.mock("../../hooks/useMain", () => ({
    useMain: () => ({
        connect: "DISCONNECTED",
        onConnectionStatesPress: vi.fn(),
        onHomePress: vi.fn(),
        onProfilesPress: vi.fn(),
        onSessionsPress: vi.fn(),
        onSettingsPress: vi.fn(),
        batteryLevel: 85,
        currentFirmwareVersion: "1.0.0",
        error: "",
    }),
}));

vi.mock("../../hooks", async () => {
    const { hooksMock } = await import("../support/deviceSize");
    return hooksMock({
        useMain: () => ({
            connect: "DISCONNECTED",
            onConnectionStatesPress: vi.fn(),
            onHomePress: vi.fn(),
            onProfilesPress: vi.fn(),
            onSessionsPress: vi.fn(),
            onSettingsPress: vi.fn(),
            batteryLevel: 85,
            currentFirmwareVersion: "1.0.0",
            error: "",
        }),
    });
});

vi.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: vi.fn(), goBack: vi.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: vi.fn(),
}));

const meta = {
    title: "Pages/MainScreen",
    component: MainScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof MainScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    render: renderAt("mobile", MainScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", MainScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    render: renderAt("desktop", MainScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
