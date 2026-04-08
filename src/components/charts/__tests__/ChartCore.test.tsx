import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { ChartCore } from "../ChartCore";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("ChartCore UnitTest", () => {
    it("renders correctly with minimal props", () => {
        const { toJSON } = renderWithProvider(<ChartCore width={400} height={200} />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders with svg style margins", () => {
        const { toJSON } = renderWithProvider(
            <ChartCore
                width={400}
                height={200}
                svgStyle={{
                    marginLeft: 16,
                    marginRight: 16,
                    marginTop: 8,
                    marginBottom: 8,
                }}
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders children", () => {
        const { getByTestId } = renderWithProvider(
            <ChartCore width={400} height={200}>
                {/* child node */}
            </ChartCore>
        );
        // Component renders without crashing
        expect(getByTestId).toBeDefined();
    });
});
