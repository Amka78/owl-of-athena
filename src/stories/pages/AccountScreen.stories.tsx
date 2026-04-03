import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../constants";
import { AccountScreen } from "../../components/pages/AccountScreen";

jest.mock("../../hooks/useAccount", () => ({
    useAcount: () => ({
        loading: false,
        firstName: "Jane",
        onFirstNameChangeText: jest.fn(),
        lastName: "Doe",
        onLastNameChangeText: jest.fn(),
        birthDay: new Date("1990-01-15"),
        onBirthDayChange: jest.fn(),
        gender: "female",
        onGenderChange: jest.fn(),
        onSavePress: jest.fn(),
        onLogoutPress: jest.fn(),
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
    useAcount: () => ({
        loading: false,
        firstName: "Jane",
        onFirstNameChangeText: jest.fn(),
        lastName: "Doe",
        onLastNameChangeText: jest.fn(),
        birthDay: new Date("1990-01-15"),
        onBirthDayChange: jest.fn(),
        gender: "female",
        onGenderChange: jest.fn(),
        onSavePress: jest.fn(),
        onLogoutPress: jest.fn(),
        generalError: "",
    }),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));


const meta = {
    title: "Pages/AccountScreen",
    component: AccountScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof AccountScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
