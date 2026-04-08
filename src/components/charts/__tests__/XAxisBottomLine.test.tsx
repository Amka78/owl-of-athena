//#region Import Modules

import { render } from "@testing-library/react-native";
import React from "react";
import { XAxisBottomLine } from "../XAxisBottomLine";

//#endregion

//#region Tests
describe("XAxisBottomLine UnitTest", () => {
    const defaultProps = {
        width: 300,
        height: 200,
        color: "#ffffff",
    };

    it("renders correctly", () => {
        const { toJSON } = render(<XAxisBottomLine {...defaultProps} />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders a Line with correct coordinates", () => {
        const { UNSAFE_getByType } = render(
            <XAxisBottomLine width={400} height={100} color="#ff0000" />,
        );
        const line = UNSAFE_getByType(require("react-native-svg").Line);
        expect(line.props.x1).toBe(0);
        expect(line.props.x2).toBe(400);
        expect(line.props.y1).toBe(100);
        expect(line.props.y2).toBe(100);
        expect(line.props.stroke).toBe("#ff0000");
    });
});
//#endregion
