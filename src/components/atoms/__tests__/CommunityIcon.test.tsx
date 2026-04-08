//#region Import Modules

import { render } from "@testing-library/react-native";
import React from "react";
import { CommunityIcon } from "../CommunityIcon";

//#endregion

//#region Tests
describe("CommunityIcon UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = render(<CommunityIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
