import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { SessionDesktopScreen } from "../SessionDesktopScreen";

jest.mock("../../../navigation/SessionTabNavigator", () => () => null);
jest.mock("react-native-reanimated", () =>
    require("react-native-reanimated/mock")
);
jest.mock("../../../hooks/sessions/useSessionList", () => ({
    useSessinList: () => ({
        showFilter: false,
        filterCondition: {
            byDate: "any_time",
            showNotes: false,
            showStarred: false,
        },
        onFilterPress: jest.fn(),
        onRefreshPress: jest.fn(),
        list: [],
        onSelectSession: jest.fn(),
        onDeleteSession: jest.fn(),
        onStarPress: jest.fn(),
        onNotePress: jest.fn(),
        userId: "guest",
    }),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));


const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("SessionDesktopScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<SessionDesktopScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<SessionDesktopScreen />)).not.toThrow();
    });
});
