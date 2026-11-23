//#region Import Modules

import { render } from "@testing-library/react-native";
import React from "react";
import { PrivateIcon } from "../PrivateIcon";

//#endregion

//#region Tests
describe("PrivateIcon UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = render(<PrivateIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
