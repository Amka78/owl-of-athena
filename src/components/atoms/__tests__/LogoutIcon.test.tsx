//#region Import Modules

import { render } from "@testing-library/react-native";
import React from "react";
import { LogoutIcon } from "../LogoutIcon";

//#endregion

//#region Tests
describe("LogoutIcon UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = render(<LogoutIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
