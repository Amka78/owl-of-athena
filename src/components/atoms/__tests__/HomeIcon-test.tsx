//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { HomeIcon, HomeIconProps } from "../HomeIcon";
//#endregion

//#region Test
let component: ShallowWrapper<HomeIconProps, unknown, unknown>;
describe("HomeIcon UnitTest", () => {
    it("Renders correctly", () => {
        component = createMock(<HomeIcon></HomeIcon>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
