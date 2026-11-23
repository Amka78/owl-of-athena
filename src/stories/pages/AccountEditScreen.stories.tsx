import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { AccountEditScreen } from "../../components/pages/AccountEditScreen";
import { Theme } from "../../constants";
import { renderAt } from "../support/deviceSize";

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
            countryCode: "US",
            onCountryCodeChangeText: vi.fn(),
            postalCode: "94025",
            onPostalCodeChangeText: vi.fn(),
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
    title: "Pages/AccountEditScreen",
    component: AccountEditScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof AccountEditScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    render: renderAt("mobile", AccountEditScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", AccountEditScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    render: renderAt("desktop", AccountEditScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
