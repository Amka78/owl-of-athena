import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { SleepingScreen } from "../SleepingScreen";

vi.mock("../../../hooks/useSleeping", () => ({
    useSleeping: () => ({
        wakeLockTextKey: "sleeping_wakelock_enabled",
        onRelockPress: vi.fn(),
        onWakeupPress: vi.fn(),
        isSnoozing: false,
        settings: {
            alarmHour: 7,
            alarmMinute: 0,
            smartAlarmEnabled: true,
            remStimEnabled: false,
            dslEnabled: false,
        },
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
    useSleeping: () => ({
        wakeLockTextKey: "sleeping_wakelock_enabled",
        onRelockPress: vi.fn(),
        onWakeupPress: vi.fn(),
        isSnoozing: false,
        settings: {
            alarmHour: 7,
            alarmMinute: 0,
            smartAlarmEnabled: true,
            remStimEnabled: false,
            dslEnabled: false,
        },
    }),
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
