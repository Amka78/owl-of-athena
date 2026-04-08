import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import ChartPie from "../ChartPie";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const defaultProps = {
    width: 300,
    height: 200,
    categoryPercents: [25, 35, 20, 20],
    categoryLabels: ["Deep", "Light", "REM", "Awake"],
    categoryColors: ["#3b4cca", "#9c59ff", "#00bcd4", "#ffb300"],
    legendPosition: "right" as const,
};

describe("ChartPie UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<ChartPie {...defaultProps} />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders with legend on the left", () => {
        const { toJSON } = renderWithProvider(
            <ChartPie {...defaultProps} legendPosition="left" />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders with custom inner and outer radius", () => {
        const { toJSON } = renderWithProvider(
            <ChartPie {...defaultProps} outerRadius={80} innerRadius={50} />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders with a single category", () => {
        const { toJSON } = renderWithProvider(
            <ChartPie
                {...defaultProps}
                categoryPercents={[100]}
                categoryLabels={["Deep"]}
                categoryColors={["#3b4cca"]}
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
