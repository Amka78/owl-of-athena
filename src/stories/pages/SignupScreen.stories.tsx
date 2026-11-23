import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { SignupScreen } from "../../components/pages/SignupScreen";
import { Theme } from "../../constants";
import { renderAt } from "../support/deviceSize";

vi.mock("../../hooks/useSignup", () => ({
    useSignup: () => ({
        loading: false,
        emailHooks: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
        passwordHooks: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
        passwordConfirmHooks: {
            value: "",
            onChangeText: vi.fn(),
            onEndEditing: vi.fn(),
            error: "",
        },
        checkBoxHooks: { checked: false, onPress: vi.fn() },
        onSignupPress: vi.fn(),
        onCancelPress: vi.fn(),
        onLinkTextPress: vi.fn(),
        generalError: "",
    }),
}));

vi.mock("../../hooks", async () => {
    const { hooksMock } = await import("../support/deviceSize");
    return hooksMock({
        useSignup: () => ({
            loading: false,
            emailHooks: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
            passwordHooks: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
            passwordConfirmHooks: {
                value: "",
                onChangeText: vi.fn(),
                onEndEditing: vi.fn(),
                error: "",
            },
            checkBoxHooks: { checked: false, onPress: vi.fn() },
            onSignupPress: vi.fn(),
            onCancelPress: vi.fn(),
            onLinkTextPress: vi.fn(),
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
    title: "Pages/SignupScreen",
    component: SignupScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof SignupScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    render: renderAt("mobile", SignupScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", SignupScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    render: renderAt("desktop", SignupScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
