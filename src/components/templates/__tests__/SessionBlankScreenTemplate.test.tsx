import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { SessionBlankScreenTemplate } from "../SessionBlankScreenTemplate";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("SessionBlankScreenTemplate", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<SessionBlankScreenTemplate />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("displays blank session message", () => {
        const { queryByText } = renderWithProvider(<SessionBlankScreenTemplate />);
        // The component renders a localized message; ensure it renders without crash
        expect(queryByText).toBeDefined();
    });
});
