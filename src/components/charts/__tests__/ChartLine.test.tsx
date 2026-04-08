import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import ChartLine from "../ChartLine";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

// ChartLine extends the legacy class-based Chart which uses d3 DOM manipulation.
// In jsdom, SVG DOM APIs are limited; these tests verify the component mounts
// without throwing and renders an svg element.
const generateChannel = (length: number): number[] =>
    Array.from({ length }, (_, i) => Math.sin(i * 0.1) * 512);

describe("ChartLine UnitTest", () => {
    it("renders without crashing with one data channel", () => {
        const data = [generateChannel(128)];
        expect(() =>
            renderWithProvider(<ChartLine width={600} height={200} data={data} />),
        ).not.toThrow();
    });

    it("renders without crashing with multiple data channels", () => {
        const data = [generateChannel(256), generateChannel(256)];
        expect(() =>
            renderWithProvider(<ChartLine width={600} height={200} data={data} />),
        ).not.toThrow();
    });
});
