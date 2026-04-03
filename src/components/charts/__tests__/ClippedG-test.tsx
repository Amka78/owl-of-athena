import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { ClippedG } from "../ClippedG";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

// ClippedG uses react-native-svg components (mocked via __mocks__) and generates
// a random clipPath ID each render, so we verify rendering without crashing.
describe("ClippedG UnitTest", () => {
    it("renders without crashing", () => {
        expect(() =>
            renderWithProvider(
                <ClippedG xChartRange={[0, 300]} yChartRange={[200, 0]}>
                    {null}
                </ClippedG>
            )
        ).not.toThrow();
    });

    it("renders without crashing with different ranges", () => {
        expect(() =>
            renderWithProvider(
                <ClippedG xChartRange={[50, 350]} yChartRange={[150, 20]}>
                    {null}
                </ClippedG>
            )
        ).not.toThrow();
    });

    it("renders a non-null tree", () => {
        const { toJSON } = renderWithProvider(
            <ClippedG xChartRange={[0, 300]} yChartRange={[200, 0]}>
                {null}
            </ClippedG>
        );
        expect(toJSON()).not.toBeNull();
    });
});
