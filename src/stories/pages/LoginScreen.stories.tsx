import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../constants";
import { LoginScreen } from "../../components/pages/LoginScreen";

jest.mock("../../hooks/useLogin", () => ({
    useLogin: () => ({
        email: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        password: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        onLoginPress: jest.fn(),
        onCancelPress: jest.fn(),
        generalError: "",
        onForgotPasswordPress: jest.fn(),
        onSignupPress: jest.fn(),
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
    useLogin: () => ({
        email: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        password: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        onLoginPress: jest.fn(),
        onCancelPress: jest.fn(),
        generalError: "",
        onForgotPasswordPress: jest.fn(),
        onSignupPress: jest.fn(),
    }),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
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
