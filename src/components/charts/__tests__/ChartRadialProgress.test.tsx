import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { ChartRadialProgress } from "../ChartRadialProgress";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const defaultProps = {
    width: 150,
    height: 150,
    value: 75,
    valueLabel: "75%",
    bgColor: "#2a2a4a",
    fgColor: "#00d4ff",
    minValue: 0,
    maxValue: 100,
};

describe("ChartRadialProgress UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<ChartRadialProgress {...defaultProps} />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders with value 0 (empty progress)", () => {
        const { toJSON } = renderWithProvider(
            <ChartRadialProgress {...defaultProps} value={0} valueLabel="0%" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders with value at maximum", () => {
        const { toJSON } = renderWithProvider(
            <ChartRadialProgress {...defaultProps} value={100} valueLabel="100%" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders with custom radii", () => {
        const { toJSON } = renderWithProvider(
            <ChartRadialProgress {...defaultProps} outerRadius={60} innerRadius={50} />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders with custom label color and size", () => {
        const { toJSON } = renderWithProvider(
            <ChartRadialProgress {...defaultProps} valueLabelColor="#fff" valueLabelSize={18} />,
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
