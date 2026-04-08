//#region Import Modules

import { render } from "@testing-library/react-native";
import React from "react";
import { EditIcon } from "../EditIcon";

//#endregion

//#region Tests
describe("EditIcon UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = render(<EditIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
