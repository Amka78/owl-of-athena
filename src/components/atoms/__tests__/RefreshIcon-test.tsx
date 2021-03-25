//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { RefreshIcon, RefreshIconProps } from "../RefreshIcon";
//#endregion

//#region Test
let component: ShallowWrapper<RefreshIconProps, unknown, unknown>;
describe("RefreshIcon UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(<RefreshIcon></RefreshIcon>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
