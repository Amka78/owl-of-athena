//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { MenuIcon, MenuIconProps } from "../MenuIcon";
//#endregion

//#region Test
let component: ShallowWrapper<MenuIconProps, unknown, unknown>;
describe("MenuIcon UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(<MenuIcon></MenuIcon>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
