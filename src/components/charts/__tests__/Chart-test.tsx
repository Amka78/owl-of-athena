//#region Import Modules
import React from "react";
import { render } from "@testing-library/react-native";
import Chart from "../Chart";
//#endregion

//#region Tests
describe("Chart UnitTest", () => {
    it("renders correctly with required props", () => {
        const { toJSON } = render(
            <Chart width={300} height={200} />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders with custom margin", () => {
        const margin = { top: 10, right: 10, bottom: 10, left: 10 };
        const { toJSON } = render(
            <Chart
                width={300}
                height={200}
                margin={margin}
                axisMargin={margin}
            />
        );
        expect(toJSON()).toBeTruthy();
    });

    it("renders with title", () => {
        const { toJSON } = render(
            <Chart width={300} height={200} title="Test Chart" />
        );
        expect(toJSON()).toBeTruthy();
    });
});
//#endregion
