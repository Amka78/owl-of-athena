import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { SessionListScreen } from "../SessionListScreen";
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
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
        setOptions: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));


const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("SessionListScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<SessionListScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<SessionListScreen />)).not.toThrow();
    });
});
