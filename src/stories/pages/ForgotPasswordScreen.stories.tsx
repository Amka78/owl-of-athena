import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../constants";
import { ForgotPasswordScreen } from "../../components/pages/ForgotPassswordScreen";

jest.mock("../../hooks/useForgotPassword", () => ({
    useForgotPassword: () => ({
        email: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        onSendPress: jest.fn(),
        onCancelPress: jest.fn(),
        generalError: "",
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
    useForgotPassword: () => ({
        email: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        onSendPress: jest.fn(),
        onCancelPress: jest.fn(),
        generalError: "",
    }),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
        setOptions: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));

jest.mock("react-redux", () => ({
    useSelector: jest.fn(() => ({})),
    useDispatch: () => jest.fn(),
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
