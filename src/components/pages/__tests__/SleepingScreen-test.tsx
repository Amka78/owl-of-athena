import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { SleepingScreen } from "../SleepingScreen";

jest.mock("../../../hooks/useSleeping", () => ({
    useSleeping: () => ({
        wakeLockTextKey: "sleeping_wakelock_enabled",
        onRelockPress: jest.fn(),
        onWakeupPress: jest.fn(),
        settings: {
            alarmHour: 7,
            alarmMinute: 0,
            smartAlarmEnabled: true,
            remStimEnabled: false,
            dslEnabled: false,
        },
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
    useSleeping: () => ({
        wakeLockTextKey: "sleeping_wakelock_enabled",
        onRelockPress: jest.fn(),
        onWakeupPress: jest.fn(),
        settings: {
            alarmHour: 7,
            alarmMinute: 0,
            smartAlarmEnabled: true,
            remStimEnabled: false,
            dslEnabled: false,
        },
    }),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));


const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("SleepingScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<SleepingScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<SleepingScreen />)).not.toThrow();
    });
});
