import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../constants";
import { WelcomeScreen } from "../../components/pages/WelcomeScreen";

jest.mock("../../hooks/useWelcome", () => ({
    useWelcome: () => ({
        onStandalonePress: jest.fn(),
        onLoginPress: jest.fn(),
        onCancelPress: jest.fn(),
        onSignupPress: jest.fn(),
    }),
}));

jest.mock("../../hooks/useAutoLogin", () => ({
    useAutoLogin: jest.fn(),
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
    useWelcome: () => ({
        onStandalonePress: jest.fn(),
        onLoginPress: jest.fn(),
        onCancelPress: jest.fn(),
        onSignupPress: jest.fn(),
    }),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));


const meta = {
    title: "Pages/WelcomeScreen",
    component: WelcomeScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof WelcomeScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
