import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { ForgotPasswordScreen } from "../../components/pages/ForgotPasswordScreen";
import { Theme } from "../../constants";
import { renderAt } from "../support/deviceSize";

vi.mock("../../hooks/useForgotPassword", () => ({
    useForgotPassword: () => ({
        email: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
        onSendPress: vi.fn(),
        onCancelPress: vi.fn(),
        generalError: "",
    }),
}));

vi.mock("../../hooks", async () => {
    const { hooksMock } = await import("../support/deviceSize");
    return hooksMock({
        useForgotPassword: () => ({
            email: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
            onSendPress: vi.fn(),
            onCancelPress: vi.fn(),
            generalError: "",
        }),
    });
});

vi.mock("@react-navigation/native", () => ({
    useNavigation: () => ({
        navigate: vi.fn(),
        goBack: vi.fn(),
        setOptions: vi.fn(),
    }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: vi.fn(),
}));

const meta = {
    title: "Pages/ForgotPasswordScreen",
    component: ForgotPasswordScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ForgotPasswordScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    render: renderAt("mobile", ForgotPasswordScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", ForgotPasswordScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    render: renderAt("desktop", ForgotPasswordScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
