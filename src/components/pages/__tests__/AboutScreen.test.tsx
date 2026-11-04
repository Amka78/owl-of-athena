import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { AboutScreen } from "../AboutScreen";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("AboutScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<AboutScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<AboutScreen />)).not.toThrow();
    });
});