import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { ForgotPasswordScreen } from "../../components/pages/ForgotPasswordScreen";
import { Theme } from "../../constants";

vi.mock("../../hooks/useForgotPassword", () => ({
    useForgotPassword: () => ({
        email: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
        onSendPress: vi.fn(),
        onCancelPress: vi.fn(),
        generalError: "",
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
    useForgotPassword: () => ({
        email: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
        onSendPress: vi.fn(),
        onCancelPress: vi.fn(),
        generalError: "",
    }),
}));

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

export const Primary: Story = {
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
