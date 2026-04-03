import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { HomeScreen } from "../HomeScreen";

jest.mock("../../../hooks/useHome", () => ({
    useHome: () => ({
        settings: { alarmHour: 9, alarmMinute: 0 },
        timeViewPress: jest.fn(),
        goToSleepPress: jest.fn(),
        errorText: "",
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
    useHome: () => ({
        settings: { alarmHour: 9, alarmMinute: 0 },
        timeViewPress: jest.fn(),
        goToSleepPress: jest.fn(),
        errorText: "",
    }),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
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
