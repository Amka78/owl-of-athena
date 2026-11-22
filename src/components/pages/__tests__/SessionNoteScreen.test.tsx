import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { SessionNoteScreen } from "../SessionNoteScreen";

vi.mock("../../../hooks/sessions/useSessionNote", () => ({
    useSessionNote: () => ({
        onBlur: vi.fn(),
        onChangeText: vi.fn(),
        notes: "Great sleep tonight!",
    }),
}));

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("SessionNoteScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<SessionNoteScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<SessionNoteScreen />)).not.toThrow();
    });
});
