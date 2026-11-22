import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { LoginScreen } from "../../components/pages/LoginScreen";
import { Theme } from "../../constants";

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

export const Primary: Story = {
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
