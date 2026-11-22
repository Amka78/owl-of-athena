import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { HomeScreen } from "../HomeScreen";

vi.mock("../../../hooks/useHome", () => ({
    useHome: () => ({
        settings: { alarmHour: 9, alarmMinute: 0 },
        timeViewPress: vi.fn(),
        goToSleepPress: vi.fn(),
        errorText: "",
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
    useHome: () => ({
        settings: { alarmHour: 9, alarmMinute: 0 },
        timeViewPress: vi.fn(),
        goToSleepPress: vi.fn(),
        errorText: "",
    }),
}));

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("HomeScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<HomeScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<HomeScreen />)).not.toThrow();
    });
});
