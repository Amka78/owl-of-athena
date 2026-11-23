//#region Import Modules

import { render } from "@testing-library/react-native";
import React from "react";
import { SettingsIcon } from "../SettingsIcon";

//#endregion

//#region Tests
describe("SettingsIcon UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = render(<SettingsIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
