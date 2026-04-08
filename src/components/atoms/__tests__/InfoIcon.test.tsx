//#region Import Modules

import { render } from "@testing-library/react-native";
import React from "react";
import { InfoIcon } from "../Infocon";

//#endregion

//#region Tests
describe("InfoIcon UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = render(<InfoIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
