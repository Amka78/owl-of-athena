//#region Import Modules

import { render } from "@testing-library/react-native";
import React from "react";
import { XAxisTopLine } from "../XAxisTopLine";

//#endregion

//#region Tests
describe("XAxisTopLine UnitTest", () => {
    const defaultProps = {
        width: 300,
        color: "#ffffff",
    };

    it("renders correctly", () => {
        const { toJSON } = render(<XAxisTopLine {...defaultProps} />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders a Line at y=0", () => {
        const { UNSAFE_getByType } = render(<XAxisTopLine width={500} color="#00ff00" />);
        const line = UNSAFE_getByType(require("react-native-svg").Line);
        expect(line.props.x1).toBe(0);
        expect(line.props.x2).toBe(500);
        expect(line.props.y1).toBe(0);
        expect(line.props.y2).toBe(0);
        expect(line.props.stroke).toBe("#00ff00");
    });
});
//#endregion
