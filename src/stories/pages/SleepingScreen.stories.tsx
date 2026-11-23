import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { SleepingScreen } from "../../components/pages/SleepingScreen";
import { Theme } from "../../constants";
import { renderAt } from "../support/deviceSize";

vi.mock("../../hooks/useSleeping", () => ({
    useSleeping: () => ({
        wakeLockTextKey: "sleeping_wakelock_enabled",
        onRelockPress: vi.fn(),
        onWakeupPress: vi.fn(),
        settings: {
            alarmHour: 7,
            alarmMinute: 0,
            smartAlarmEnabled: true,
            remStimEnabled: false,
            dslEnabled: false,
        },
    }),
}));

vi.mock("../../hooks", async () => {
    const { hooksMock } = await import("../support/deviceSize");
    return hooksMock({
        useSleeping: () => ({
            wakeLockTextKey: "sleeping_wakelock_enabled",
            onRelockPress: vi.fn(),
            onWakeupPress: vi.fn(),
            settings: {
                alarmHour: 7,
                alarmMinute: 0,
                smartAlarmEnabled: true,
                remStimEnabled: false,
                dslEnabled: false,
            },
        }),
    });
});

vi.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: vi.fn(), goBack: vi.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: vi.fn(),
}));

const meta = {
    title: "Pages/SleepingScreen",
    component: SleepingScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof SleepingScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    render: renderAt("mobile", SleepingScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", SleepingScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    render: renderAt("desktop", SleepingScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
