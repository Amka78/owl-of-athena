//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { SettingsIcon, SettingsIconProps } from "../SettingsIcon";
//#endregion

//#region Test
let component: ShallowWrapper<SettingsIconProps, unknown, unknown>;
describe("SettingsIcon UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(<SettingsIcon></SettingsIcon>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
