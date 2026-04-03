import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { SessionScreen } from "../SessionScreen";

jest.mock("../../../hooks/sessions/useSession", () => ({
    useSession: () => ({
        selectedSession: {},
        selectedSessionDetail: {},
        asleepAt: { hours: () => 22, minutes: () => 30 },
        awakeAt: { hours: () => 6, minutes: () => 0 },
        sleepDuration: { hours: 7, minutes: 30 },
        remDuration: { hours: 1, minutes: 45 },
        deepDuration: { hours: 2, minutes: 15 },
        radialProgress: 82,
        chartSelectButtonPress: jest.fn(),
        currentChart: "PieChart",
        scaleXDomain: [1620000000000, 1620028800000],
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

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("SessionScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<SessionScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<SessionScreen />)).not.toThrow();
    });
});
