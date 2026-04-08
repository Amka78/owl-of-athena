import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { ProfilePreviewScreen } from "../ProfilePreviewScreen";

jest.mock("../../../hooks/profiles/useProfilePreview", () => ({
    useProfilePreview: () => ({
        content: '{"name":"Sleep Optimizer","description":"Optimized for deep sleep"}',
    }),
}));



const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("ProfilePreviewScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<ProfilePreviewScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<ProfilePreviewScreen />)).not.toThrow();
    });
});
