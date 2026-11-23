//#region Import Modules

import { render } from "@testing-library/react-native";
import React from "react";
import { RefreshIcon } from "../RefreshIcon";

//#endregion

//#region Tests
describe("RefreshIcon UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = render(<RefreshIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
