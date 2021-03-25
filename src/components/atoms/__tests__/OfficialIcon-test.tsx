//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { OfficialIcon, OfficialIconProps } from "../OfficialIcon";
//#endregion

//#region Test
let component: ShallowWrapper<OfficialIconProps, unknown, unknown>;
describe("OfficialIcon UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(<OfficialIcon></OfficialIcon>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
