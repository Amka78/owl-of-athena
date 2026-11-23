import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { ResetPasswordScreen } from "../../components/pages/ResetPasswordScreen";
import { Theme } from "../../constants";
import { renderAt } from "../support/deviceSize";

vi.mock("../../hooks", async () => {
    const { hooksMock } = await import("../support/deviceSize");
    return hooksMock({
        usePasswordReset: () => ({
            state: "request",
            newPassword: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
            confirmPassword: {
                value: "",
                onChangeText: vi.fn(),
                onEndEditing: vi.fn(),
                error: "",
            },
            errorText: "",
            onSavePress: vi.fn(),
            onGoLoginPress: vi.fn(),
            onRequestNewLinkPress: vi.fn(),
        }),
    });
});

vi.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: vi.fn(), goBack: vi.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: vi.fn(),
}));

const meta = {
    title: "Pages/ResetPasswordScreen",
    component: ResetPasswordScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ResetPasswordScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    render: renderAt("mobile", ResetPasswordScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", ResetPasswordScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    render: renderAt("desktop", ResetPasswordScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
