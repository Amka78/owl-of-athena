import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { AccountScreen } from "../../components/pages/AccountScreen";
import { Theme } from "../../constants";
import { renderAt } from "../support/deviceSize";

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

vi.mock("../../hooks", async () => {
    const { hooksMock } = await import("../support/deviceSize");
    return hooksMock({
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
    });
});

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

export const Mobile: Story = {
    render: renderAt("mobile", AccountScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", AccountScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    render: renderAt("desktop", AccountScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
