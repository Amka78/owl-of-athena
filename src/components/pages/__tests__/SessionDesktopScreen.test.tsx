import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { SessionDesktopScreen } from "../SessionDesktopScreen";

vi.mock("../../../navigation/SessionTabNavigator", () => ({ default: () => null }));
vi.mock("react-native-reanimated", () => require("react-native-reanimated/mock"));
vi.mock("../../../hooks/sessions/useSessionList", () => ({
    useSessinList: () => ({
        showFilter: false,
        filterCondition: {
            byDate: "any_time",
            showNotes: false,
            showStarred: false,
        },
        onFilterPress: vi.fn(),
        onRefreshPress: vi.fn(),
        list: [],
        onSelectSession: vi.fn(),
        onDeleteSession: vi.fn(),
        onStarPress: vi.fn(),
        onNotePress: vi.fn(),
        userId: "guest",
    }),
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
