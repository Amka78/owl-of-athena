import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { WakingScreen } from "../../components/pages/WakingScreen";
import { Theme } from "../../constants";

vi.mock("../../hooks/useWaking ", () => ({
    useWaking: () => ({
        wakeupButtonPress: vi.fn(),
        settings: {
            alarmHour: 7,
            alarmMinute: 0,
            smartAlarmEnabled: true,
            remStimEnabled: false,
            dslEnabled: false,
        },
    }),
}));

vi.mock("../../hooks", () => ({
    useLocale: () => undefined,
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
    useConvertibleHeader: vi.fn(),
    useWaking: () => ({
        wakeupButtonPress: vi.fn(),
        settings: {
            alarmHour: 7,
            alarmMinute: 0,
            smartAlarmEnabled: true,
            remStimEnabled: false,
            dslEnabled: false,
        },
    }),
}));

vi.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: vi.fn(), goBack: vi.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: vi.fn(),
}));

const meta = {
    title: "Pages/WakingScreen",
    component: WakingScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof WakingScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
