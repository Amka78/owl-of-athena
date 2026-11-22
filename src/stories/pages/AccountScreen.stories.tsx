import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { AccountScreen } from "../../components/pages/AccountScreen";
import { Theme } from "../../constants";

vi.mock("../../hooks/useAccount", () => ({
    useAcount: () => ({
        loading: false,
        firstName: "Jane",
        onFirstNameChangeText: vi.fn(),
        lastName: "Doe",
        onLastNameChangeText: vi.fn(),
        birthDay: new Date("1990-01-15"),
        onBirthDayChange: vi.fn(),
        gender: "female",
        onGenderChange: vi.fn(),
        onSavePress: vi.fn(),
        onLogoutPress: vi.fn(),
        generalError: "",
    }),
}));

vi.mock("../../hooks/useUnreadMessageCount", () => ({
    useUnreadMessageCount: () => 2,
}));

vi.mock("../../hooks/useDeviceMaintenance", () => ({
    useDeviceMaintenance: () => ({
        connected: true,
        busy: false,
        onFormatSdCardPress: vi.fn(),
        onResetDevicePress: vi.fn(),
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
    useAcount: () => ({
        loading: false,
        firstName: "Jane",
        onFirstNameChangeText: vi.fn(),
        lastName: "Doe",
        onLastNameChangeText: vi.fn(),
        birthDay: new Date("1990-01-15"),
        onBirthDayChange: vi.fn(),
        gender: "female",
        onGenderChange: vi.fn(),
        onSavePress: vi.fn(),
        onLogoutPress: vi.fn(),
        generalError: "",
    }),
}));

vi.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: vi.fn(), goBack: vi.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: vi.fn(),
}));

const meta = {
    title: "Pages/AccountScreen",
    component: AccountScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof AccountScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
