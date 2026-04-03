import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../constants";
import { SettingsScreen } from "../../components/pages/SettingsScreen";

jest.mock("../../hooks/useSetting", () => ({
    useSetting: () => ({
        inlineTimePickerOnChangeTime: jest.fn(),
        datePickerState: { hours: 7, minutes: 30 },
        smartAlarmAudio: { name: "birds" },
        remStimAudio: { name: "white_noise" },
        smartAlarmEnabled: true,
        remStimEnabled: false,
        dslEnabled: false,
        onSmartAlarmEnabledPress: jest.fn(),
        onRemStimEnabledPress: jest.fn(),
        onDslEnabledPress: jest.fn(),
        onSmartAlarmAudioPress: jest.fn(),
        onRemStimAudioPress: jest.fn(),
        onSavePress: jest.fn(),
        selectedProfile: { title: "Default Profile" },
        onProfilesPress: jest.fn(),
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
    useSetting: () => ({
        inlineTimePickerOnChangeTime: jest.fn(),
        datePickerState: { hours: 7, minutes: 30 },
        smartAlarmAudio: { name: "birds" },
        remStimAudio: { name: "white_noise" },
        smartAlarmEnabled: true,
        remStimEnabled: false,
        dslEnabled: false,
        onSmartAlarmEnabledPress: jest.fn(),
        onRemStimEnabledPress: jest.fn(),
        onDslEnabledPress: jest.fn(),
        onSmartAlarmAudioPress: jest.fn(),
        onRemStimAudioPress: jest.fn(),
        onSavePress: jest.fn(),
        selectedProfile: { title: "Default Profile" },
        onProfilesPress: jest.fn(),
    }),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));

jest.mock("react-redux", () => ({
    useSelector: jest.fn(() => ({})),
    useDispatch: () => jest.fn(),
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
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};
