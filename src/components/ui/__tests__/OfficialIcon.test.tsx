//#region Import Modules

import { render } from "@testing-library/react-native";
import React from "react";
import { OfficialIcon } from "../OfficialIcon";

//#endregion

//#region Tests
describe("OfficialIcon UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = render(<OfficialIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
