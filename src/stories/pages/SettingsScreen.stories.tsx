import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { SettingsScreen } from "../../components/pages/SettingsScreen";
import { Theme } from "../../constants";

// vi.mock ファクトリはファイル先頭へホイストされるため、関数宣言で定義する
// （const/let 参照は TDZ エラーになる）。
function mockUseSetting() {
    return {
        inlineTimePickerOnChangeTime: vi.fn(),
        datePickerState: { hours: 7, minutes: 30 },
        smartAlarmAudio: { name: "birds" },
        smartAlarmAudioMenuOnPress: vi.fn(),
        profiles: [],
        profileState: { profileId: "default", profileTitle: "Default Profile" },
        profileMenuOnPress: vi.fn(),
        smartAlarmEnabledStatus: "checked" as const,
        smartAlarmEnabledOnPress: vi.fn(),
        dslEnabledStatus: "unchecked" as const,
        dslEnabledOnPress: vi.fn(),
        remStimEnabledStatus: "unchecked" as const,
        remStimEnabledOnPress: vi.fn(),
        remStimAudio: { name: "white_noise" },
        remStimAudioMenuOnPress: vi.fn(),
        alarmVolume: 0.8,
        onAlarmVolumeChange: vi.fn(),
        saveButtonPress: vi.fn(),
        cancelButtonPress: vi.fn(),
    };
}

vi.mock("../../hooks/useSetting", () => ({
    useSetting: mockUseSetting,
}));

vi.mock("../../hooks", () => ({
    useLocale: () => undefined,
    useConvertibleHeader: () => undefined,
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
    useSetting: mockUseSetting,
}));

vi.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: vi.fn(), goBack: vi.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: vi.fn(),
}));

const meta = {
    title: "Pages/SettingsScreen",
    component: SettingsScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof SettingsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
