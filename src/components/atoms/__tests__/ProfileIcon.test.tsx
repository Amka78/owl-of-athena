//#region Import Modules

import { render } from "@testing-library/react-native";
import React from "react";
import { ProfilesIcon } from "../ProfilesIcon";

//#endregion

//#region Tests
describe("ProfilesIcon UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = render(<ProfilesIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
