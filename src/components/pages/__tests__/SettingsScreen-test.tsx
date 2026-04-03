import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { SettingsScreen } from "../SettingsScreen";

jest.mock("../../../hooks/useSetting", () => ({
    useSetting: () => ({
        inlineTimePickerOnChangeTime: jest.fn(),
        datePickerState: { hours: 7, minutes: 30 },
        smartAlarmAudio: { name: "birds", path: "" },
        smartAlarmAudioMenuOnPress: jest.fn(),
        remStimAudio: { name: "white_noise", path: "" },
        remStimAudioMenuOnPress: jest.fn(),
        profileState: { profileId: "1", profileTitle: "Default Profile" },
        profileMenuOnPress: jest.fn(),
        profiles: [{ title: "Default Profile" }],
        smartAlarmEnabledStatus: "checked",
        smartAlarmEnabledOnPress: jest.fn(),
        remStimEnabledStatus: "unchecked",
        remStimEnabledOnPress: jest.fn(),
        dslEnabledStatus: "unchecked",
        dslEnabledOnPress: jest.fn(),
        onSavePress: jest.fn(),
    }),
}));

jest.mock("../../../hooks", () => ({
    useLocale: jest.fn(),
    useConvertibleHeader: jest.fn(),
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
