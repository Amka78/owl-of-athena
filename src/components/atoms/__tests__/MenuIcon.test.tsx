//#region Import Modules

import { render } from "@testing-library/react-native";
import React from "react";
import { MenuIcon } from "../MenuIcon";

//#endregion

//#region Tests
describe("MenuIcon UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = render(<MenuIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
