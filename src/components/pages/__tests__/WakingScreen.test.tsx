import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { WakingScreen } from "../WakingScreen";

jest.mock("../../../hooks/useWaking ", () => ({
    useWaking: () => ({
        wakeupButtonPress: jest.fn(),
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
    useWaking: () => ({
        wakeupButtonPress: jest.fn(),
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

describe("WakingScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<WakingScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<WakingScreen />)).not.toThrow();
    });
});
