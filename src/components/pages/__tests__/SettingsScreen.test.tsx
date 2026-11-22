import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { SettingsScreen } from "../SettingsScreen";

vi.mock("../../../hooks/useSetting", () => ({
    useSetting: () => ({
        inlineTimePickerOnChangeTime: vi.fn(),
        datePickerState: { hours: 7, minutes: 30 },
        smartAlarmAudio: { name: "birds", path: "" },
        smartAlarmAudioMenuOnPress: vi.fn(),
        remStimAudio: { name: "white_noise", path: "" },
        remStimAudioMenuOnPress: vi.fn(),
        profileState: { profileId: "1", profileTitle: "Default Profile" },
        profileMenuOnPress: vi.fn(),
        profiles: [{ title: "Default Profile" }],
        smartAlarmEnabledStatus: "checked",
        smartAlarmEnabledOnPress: vi.fn(),
        remStimEnabledStatus: "unchecked",
        remStimEnabledOnPress: vi.fn(),
        dslEnabledStatus: "unchecked",
        dslEnabledOnPress: vi.fn(),
        onSavePress: vi.fn(),
    }),
}));

vi.mock("../../../hooks", () => ({
    useLocale: vi.fn(),
    useConvertibleHeader: vi.fn(),
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
        inlineTimePickerOnChangeTime: vi.fn(),
        datePickerState: { hours: 7, minutes: 30 },
        smartAlarmAudio: { name: "birds" },
        remStimAudio: { name: "white_noise" },
        smartAlarmEnabled: true,
        remStimEnabled: false,
        dslEnabled: false,
        onSmartAlarmEnabledPress: vi.fn(),
        onRemStimEnabledPress: vi.fn(),
        onDslEnabledPress: vi.fn(),
        onSmartAlarmAudioPress: vi.fn(),
        onRemStimAudioPress: vi.fn(),
        onSavePress: vi.fn(),
        selectedProfile: { title: "Default Profile" },
        onProfilesPress: vi.fn(),
    }),
}));

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("SettingsScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<SettingsScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<SettingsScreen />)).not.toThrow();
    });
});
