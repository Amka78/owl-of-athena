import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../constants";
import { MainScreen } from "../../components/pages/MainScreen";

jest.mock("../../hooks/useMain", () => ({
    useMain: () => ({
        connect: "DISCONNECTED",
        onConnectionStatesPress: jest.fn(),
        onHomePress: jest.fn(),
        onProfilesPress: jest.fn(),
        onSessionsPress: jest.fn(),
        onSettingsPress: jest.fn(),
        batteryLevel: 85,
        currentFirmwareVersion: "1.0.0",
        error: "",
    }),
}));

jest.mock("../../hooks", () => ({
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
        onConnectionStatesPress: jest.fn(),
        onHomePress: jest.fn(),
        onProfilesPress: jest.fn(),
        onSessionsPress: jest.fn(),
        onSettingsPress: jest.fn(),
        batteryLevel: 85,
        currentFirmwareVersion: "1.0.0",
        error: "",
    }),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));

jest.mock("react-redux", () => ({
    useSelector: jest.fn(() => ({})),
    useDispatch: () => jest.fn(),
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
