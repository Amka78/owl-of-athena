import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { SessionScreen } from "../../components/pages/SessionScreen";
import { Theme } from "../../constants";

vi.mock("../../hooks/sessions/useSession", () => ({
    useSession: () => ({
        selectedSession: {},
        selectedSessionDetail: {},
        asleepAt: { hours: () => 22, minutes: () => 30 },
        awakeAt: { hours: () => 6, minutes: () => 0 },
        sleepDuration: { hours: 7, minutes: 30 },
        remDuration: { hours: 1, minutes: 45 },
        deepDuration: { hours: 2, minutes: 15 },
        radialProgress: 82,
        chartSelectButtonPress: vi.fn(),
        currentChart: "PieChart",
        scaleXDomain: [Date.now() - 3600000 * 8, Date.now()],
    }),
}));

vi.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: vi.fn(), goBack: vi.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: vi.fn(),
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
