import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { SessionScreen } from "../../components/pages/SessionScreen";
import { Theme } from "../../constants";

jest.mock("../../hooks/sessions/useSession", () => ({
    useSession: () => ({
        selectedSession: {},
        selectedSessionDetail: {},
        asleepAt: { hours: () => 22, minutes: () => 30 },
        awakeAt: { hours: () => 6, minutes: () => 0 },
        sleepDuration: { hours: 7, minutes: 30 },
        remDuration: { hours: 1, minutes: 45 },
        deepDuration: { hours: 2, minutes: 15 },
        radialProgress: 82,
        chartSelectButtonPress: jest.fn(),
        currentChart: "PieChart",
        scaleXDomain: [Date.now() - 3600000 * 8, Date.now()],
    }),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));

const meta = {
    title: "Pages/SessionScreen",
    component: SessionScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof SessionScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
