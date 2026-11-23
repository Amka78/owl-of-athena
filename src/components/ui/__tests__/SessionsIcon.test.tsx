//#region Import Modules

import { render } from "@testing-library/react-native";
import React from "react";
import { SessionsIcon } from "../SessionsIcon";

//#endregion

//#region Tests
describe("SessionsIcon UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = render(<SessionsIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
