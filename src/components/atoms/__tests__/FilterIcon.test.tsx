//#region Import Modules

import { render } from "@testing-library/react-native";
import React from "react";
import { FilterIcon } from "../FilterIcon";

//#endregion

//#region Tests
describe("FilterIcon UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = render(<FilterIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
