import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { MainScreen } from "../../components/pages/MainScreen";
import { Theme } from "../../constants";

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

vi.mock("../../hooks", () => ({
    useLocale: () => undefined,
    useConvertibleHeader: () => undefined,
    useScreenDimensions: () => ({
        width: 375,
        height: 800,
        isDesktop: false,
        isLargeWidth: false,
        isSmallHeight: false,
        isVertical: true,
        isHorizontal: false,
        fontScale: 1,
        scale: 2,
    }),
    useWindowDimensions: () => ({
        width: 375,
        height: 800,
        isDesktop: false,
        isLargeWidth: false,
        isSmallHeight: false,
        isVertical: true,
        isHorizontal: false,
        fontScale: 1,
        scale: 2,
    }),
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

export const Primary: Story = {
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
