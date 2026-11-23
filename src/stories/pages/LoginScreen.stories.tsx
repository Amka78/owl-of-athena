import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { LoginScreen } from "../../components/pages/LoginScreen";
import { Theme } from "../../constants";
import { renderAt } from "../support/deviceSize";

vi.mock("../../hooks/useLogin", () => ({
    useLogin: () => ({
        email: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
        password: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
        onLoginPress: vi.fn(),
        onCancelPress: vi.fn(),
        generalError: "",
        onForgotPasswordPress: vi.fn(),
        onSignupPress: vi.fn(),
    }),
}));

vi.mock("../../hooks", async () => {
    const { hooksMock } = await import("../support/deviceSize");
    return hooksMock({
        useLogin: () => ({
            email: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
            password: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
            onLoginPress: vi.fn(),
            onCancelPress: vi.fn(),
            generalError: "",
            onForgotPasswordPress: vi.fn(),
            onSignupPress: vi.fn(),
        }),
    });
});

vi.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: vi.fn(), goBack: vi.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: vi.fn(),
}));

const meta = {
    title: "Pages/LoginScreen",
    component: LoginScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof LoginScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    render: renderAt("mobile", LoginScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", LoginScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    render: renderAt("desktop", LoginScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
