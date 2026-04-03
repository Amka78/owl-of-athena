import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../constants";
import { SignupScreen } from "../../components/pages/SignupScreen";

jest.mock("../../hooks/useSignup", () => ({
    useSignup: () => ({
        loading: false,
        emailHooks: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        passwordHooks: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        passwordConfirmHooks: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        checkBoxHooks: { checked: false, onPress: jest.fn() },
        onSignupPress: jest.fn(),
        onCancelPress: jest.fn(),
        onLinkTextPress: jest.fn(),
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
    useConvertibleHeader: jest.fn(),
    useSignup: () => ({
        loading: false,
        emailHooks: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        passwordHooks: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        passwordConfirmHooks: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        checkBoxHooks: { checked: false, onPress: jest.fn() },
        onSignupPress: jest.fn(),
        onCancelPress: jest.fn(),
        onLinkTextPress: jest.fn(),
        generalError: "",
    }),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
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

export const Primary: Story = {
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
