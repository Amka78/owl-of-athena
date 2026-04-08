import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { HomeScreen } from "../../components/pages/HomeScreen";
import { Theme } from "../../constants";

jest.mock("../../hooks/useHome", () => ({
    useHome: () => ({
        settings: { alarmHour: 9, alarmMinute: 0 },
        timeViewPress: jest.fn(),
        goToSleepPress: jest.fn(),
        errorText: "",
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
    useHome: () => ({
        settings: { alarmHour: 9, alarmMinute: 0 },
        timeViewPress: jest.fn(),
        goToSleepPress: jest.fn(),
        errorText: "",
    }),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));

const meta = {
    title: "Pages/HomeScreen",
    component: HomeScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof HomeScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
